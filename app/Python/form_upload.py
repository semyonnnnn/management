# forms_upload.py
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import zipfile, io

router = APIRouter()

DANGEROUS_PREFIXES = ("=", "+", "-", "@")

PERIOD_MAP = {
    "год": "годовая",
    "годовая": "годовая",
    "полугод": "полугодовая",
    "полугодовая": "полугодовая",
    "квартал": "квартальная",
    "квартальная": "квартальная",
    "месяц": "месячная",
    "месячная": "месячная",
}

DEFAULT_PERIOD = "месячная"


def sanitize(value):
    """Formula-injection guard for free-text fields (e.g. form name)."""
    if isinstance(value, str):
        value = value.strip()
        if value and value[0] in DANGEROUS_PREFIXES:
            value = "'" + value
    return value


def clean_code(raw) -> str:
    """Strip whitespace and Excel 'force text' leading apostrophe artifact."""
    code = str(raw).strip()
    if code.startswith("'"):
        code = code[1:]
    return code.strip()


def parse_int(raw, field: str, row_num: int, errors: list) -> int | None:
    try:
        return int(float(str(raw).strip()))
    except (ValueError, TypeError):
        errors.append({"row": row_num, "column": field, "message": f"Ожидалось целое число, получено '{raw}'"})
        return None


def parse_decimal(raw, field: str, row_num: int, errors: list) -> float | None:
    try:
        return round(float(str(raw).strip().replace(",", ".")), 2)
    except (ValueError, TypeError):
        errors.append({"row": row_num, "column": field, "message": f"Ожидалось число, получено '{raw}'"})
        return None


def normalize_period(raw) -> str:
    """No match -> defaults to месячная instead of erroring."""
    text = str(raw).strip().lower()
    for key, value in PERIOD_MAP.items():
        if key in text:
            return value
    return DEFAULT_PERIOD


def has_macros(content: bytes) -> bool:
    try:
        with zipfile.ZipFile(io.BytesIO(content)) as z:
            return "xl/vbaProject.bin" in z.namelist()
    except zipfile.BadZipFile:
        return False


@router.post("/forms/import")
async def import_forms(file: UploadFile = File(...)):
    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ("xlsx", "xls", "csv"):
        raise HTTPException(400, "Unsupported file type")

    content = await file.read()

    if ext == "xlsx" and has_macros(content):
        raise HTTPException(400, "Macro-enabled files are not allowed")

    try:
        # Row 1 = title, row 2 = headers -> skip both, no header row at all.
        # Columns by position:
        # 0 okud | 1 name | 2 period | 3 indicators | 4 k1 | 5 k2 | 6 k3 | 7 k4 | 8 k5 | 9 k6
        if ext == "csv":
            df = pd.read_csv(io.BytesIO(content), skiprows=2, header=None)
        else:
            df = pd.read_excel(io.BytesIO(content), skiprows=2, header=None)
    except Exception:
        raise HTTPException(400, "Could not parse file")

    # Drop fully blank trailing rows
    df = df.dropna(subset=[0, 1], how="any")

    rows, errors = [], []
    for i, r in df.iterrows():
        row_num = int(i) + 3  # +1 for 0-index, +2 for the two skipped rows

        okud = parse_int(r[0], "okud", row_num, errors)
        name = sanitize(str(r[1]).strip())
        period = normalize_period(r[2])  # defaults to месячная, never errors
        indicators = parse_int(r[3], "indicators", row_num, errors)
        k1 = parse_decimal(r[4], "k1", row_num, errors)
        k2 = parse_decimal(r[5], "k2", row_num, errors)
        k3 = parse_decimal(r[6], "k3", row_num, errors)
        k4 = parse_decimal(r[7], "k4", row_num, errors)
        k5 = parse_decimal(r[8], "k5", row_num, errors)
        k6 = parse_decimal(r[9], "k6", row_num, errors)

        # No explicit "is_consolidated" column in the sheet -> defaults false.
        is_consolidated = False

        if not name:
            errors.append({"row": row_num, "column": "name", "message": "Индекс формы обязателен"})

        if any(v is None for v in (okud, indicators, k1, k2, k3, k4, k5, k6)) or not name:
            continue

        rows.append({
            "okud": okud,
            "name": name,
            "period": period,
            "indicators": indicators,
            "k1": k1,
            "k2": k2,
            "k3": k3,
            "k4": k4,
            "k5": k5,
            "k6": k6,
            "is_consolidated": is_consolidated,
        })

    if errors:
        raise HTTPException(status_code=422, detail={"errors": errors})

    return {"rows": rows}