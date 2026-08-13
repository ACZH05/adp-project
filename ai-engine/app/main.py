from app.module import app_module
from fastapi import FastAPI

app = FastAPI(title="License Application AI Engine")

app.include_router(app_module())
