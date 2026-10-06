from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from io import BytesIO
import pandas as pd
import logging

from state_upload import router as state_upload_router
from form_upload import router as form_upload_router

from forms_distribution import FormsDistribution
from utils import json_ready

app = FastAPI()
app.include_router(state_upload_router)
app.include_router(form_upload_router)

@app.post("/forms_distribution/import")
async def process(file: UploadFile = File(...)):
    xls_matrix = pd.ExcelFile(BytesIO(await file.read()))
    forms_distribution = FormsDistribution(xls_matrix)
    result = forms_distribution.process_data()
    return JSONResponse(content={"data": result})