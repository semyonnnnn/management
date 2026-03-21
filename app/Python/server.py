from fastapi import FastAPI, UploadFile, File
import pandas as pd
from io import BytesIO

app = FastAPI()

def clean_df(df: pd.DataFrame) -> pd.DataFrame:
    # Strip strings column-wise (only object/string columns)
    for col in df.select_dtypes(include='object'):
        df[col] = df[col].astype(str).str.strip()
    # Drop fully empty rows
    df = df.dropna(how='all')
    return df

@app.post("/process")
async def process(
    matrix: UploadFile = File(...),
    forms: UploadFile = File(...),
):
    matrix_result = {}
    forms_result = {}

    # Read matrix bytes into memory
    matrix_bytes = await matrix.read()
    xls_matrix = pd.ExcelFile(BytesIO(matrix_bytes))
    for sheet_name in xls_matrix.sheet_names:
        df = pd.read_excel(xls_matrix, sheet_name=sheet_name)
        df = clean_df(df)
        matrix_result[str(sheet_name)] = {
            "rows": int(len(df)),
            "columns": int(len(df.columns)),
            "column_names": [str(c) for c in df.columns]
        }

    # Read forms bytes into memory
    forms_bytes = await forms.read()
    xls_forms = pd.ExcelFile(BytesIO(forms_bytes))
    for sheet_name in xls_forms.sheet_names:
        df = pd.read_excel(xls_forms, sheet_name=sheet_name)
        df = clean_df(df)
        forms_result[str(sheet_name)] = {
            "rows": int(len(df)),
            "columns": int(len(df.columns)),
            "column_names": [str(c) for c in df.columns]
        }

    return {
        "matrix": matrix_result,
        "forms": forms_result
    }