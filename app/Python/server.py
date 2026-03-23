from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from io import BytesIO
import pandas as pd
import logging

# Local imports
from processor import DepartmentProcessor
from utils import json_ready

app = FastAPI()

@app.post("/process")
async def process(matrix: UploadFile = File(...), forms: UploadFile = File(...)):
    try:
        # 1. Read files into memory
        df_forms = pd.read_excel(BytesIO(await forms.read()), header=None)
        xls_matrix = pd.ExcelFile(BytesIO(await matrix.read()))

        # 2. Process
        processor = DepartmentProcessor(df_forms, xls_matrix)
        processor.parse_forms()
        processor.process_matrix()

        # 3. Clean and return
        return JSONResponse(content={
            "departments": json_ready(processor.departments)
        })
        
    except Exception as e:
        logging.error(f"Error: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})