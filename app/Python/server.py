from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from io import BytesIO
import pandas as pd
import logging

from state_upload import router as state_upload_router
from form_upload import router as form_upload_router

from processor import DepartmentProcessor
from utils import json_ready

app = FastAPI()
app.include_router(state_upload_router)
app.include_router(form_upload_router)

@app.post("/process")
async def process(file: UploadFile = File(...)):
    xls_matrix = pd.ExcelFile(BytesIO(await file.read()))
    processor = DepartmentProcessor(xls_matrix)
    result = processor.process_data()
    return JSONResponse(content={"data": result})