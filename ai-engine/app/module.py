from app.verification.module import verificationModule
from fastapi import APIRouter


def app_module() -> APIRouter:
    app_router = APIRouter()

    app_router.include_router(verificationModule())

    return app_router
