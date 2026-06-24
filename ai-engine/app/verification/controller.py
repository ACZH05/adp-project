from app.verification.schema import VerificationRequest, VerificationResponse
from app.verification.service import VerificationService
from fastapi import APIRouter

router = APIRouter(prefix="/verification")
verificationService = VerificationService()


@router.post("/run", response_model=VerificationResponse)
async def runVerification(payload: VerificationRequest):
    return await verificationService.runVerification(payload)
