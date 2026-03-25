from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from io import BytesIO
import pandas as pd
import logging

from processor import DepartmentProcessor
from utils import json_ready

app = FastAPI()

@app.post("/process")
async def process(matrix: UploadFile = File(...), forms: UploadFile = File(...)):
    try:
        # Read files into memory
        df_forms = pd.read_excel(BytesIO(await forms.read()), header=None)
        xls_matrix = pd.ExcelFile(BytesIO(await matrix.read()))

        # Process
        processor = DepartmentProcessor(df_forms, xls_matrix)
        result = processor.process_data()

        # Return proper JSON
        return JSONResponse(content={
            "data": json_ready({
                "deps": result["departments"],
                "forms": result["forms"],
                "assignments": result["assignments"]
            })
        })

    except Exception as e:
        logging.exception("Error during processing")
        return JSONResponse(status_code=500, content={"error": str(e)})