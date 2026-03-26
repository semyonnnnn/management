from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from io import BytesIO
import pandas as pd
import logging

from processor import DepartmentProcessor
from utils import json_ready

app = FastAPI()

@app.post("/process")
async def process(matrix: UploadFile = File(...)):
    try:
        # Read files into memory
        xls_matrix = pd.ExcelFile(BytesIO(await matrix.read()))

        # Process
        processor = DepartmentProcessor(xls_matrix)
        result = processor.process_data()

        # Return proper JSON
        return JSONResponse(content={
            "data": json_ready({
                "deps": result["departments"],
                "forms": result["forms"],
            })
        })

    except Exception as e:
        logging.exception("Error during processing")
        return JSONResponse(status_code=500, content={"error": str(e)})