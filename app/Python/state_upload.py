# state_upload.py
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import zipfile, io

router = APIRouter()

DANGEROUS_PREFIXES = ("=", "+", "-", "@")


def sanitize(value):
    """Formula-injection guard for free-text fields (e.g. department name)."""
    if isinstance(value, str):
        value = value.strip()
        if value and value[0] in DANGEROUS_PREFIXES:
            value = "'" + value
    return value


def clean_code(raw) -> str:
    """
    Strip whitespace and the OnlyOffice/Excel 'force text' leading
    apostrophe artifact, without touching the rest of the code
    (e.g. '01к' stays '01к', only the artifact quote is removed).
    """
    code = str(raw).strip()
    if code.startswith("'"):
        code = code[1:]
    return code.strip()


def has_macros(content: bytes) -> bool:
    try:
        with zipfile.ZipFile(io.BytesIO(content)) as z:
            return "xl/vbaProject.bin" in z.namelist()
    except zipfile.BadZipFile:
        return False


@router.post("/departments/import")
async def import_departments(file: UploadFile = File(...)):
    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ("xlsx", "xls", "csv"):
        raise HTTPException(400, "Unsupported file type")

    content = await file.read()

    if ext == "xlsx" and has_macros(content):
        raise HTTPException(400, "Macro-enabled files are not allowed")

    try:
        # Row 1 = title, row 2 = headers -> skip both, no header row at all.
        # Read purely by position: col 0 = code, col 1 = name, col 2 = state.
        if ext == "csv":
            df = pd.read_csv(io.BytesIO(content), skiprows=2, header=None)
        else:
            df = pd.read_excel(io.BytesIO(content), skiprows=2, header=None)
    except Exception:
        raise HTTPException(400, "Could not parse file")

    # Drop fully blank trailing rows (e.g. rows 19-20 in the sheet)
    df = df.dropna(subset=[0, 1])

    rows, errors = [], []
    for i, r in df.iterrows():
        try:
            code = clean_code(r[0])
            territory = "krg" if "к" in code.lower() else "ekb"

            rows.append({
                "code": code,
                "name": sanitize(str(r[1]).strip()),
                "territory": territory,
                "state": int(r[2]),
            })
        except Exception as e:
            # +3 because: 0-indexed -> +1, then +2 for the two skipped rows
            errors.append({"row": int(i) + 3, "error": str(e)})

    return {"rows": rows, "errors": errors}