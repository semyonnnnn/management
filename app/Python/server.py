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
    xls_matrix = pd.ExcelFile(BytesIO(await matrix.read()))
    processor = DepartmentProcessor(xls_matrix)
    result = processor.process_data()
    return JSONResponse(content={"data": result})