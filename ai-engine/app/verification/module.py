from app.verification.controller import router as VerificationController
from fastapi import APIRouter


def verificationModule() -> APIRouter:
    router = APIRouter()
    router.include_router(VerificationController)

    return router
