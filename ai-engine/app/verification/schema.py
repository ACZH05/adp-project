from app.verification.types import VerificationIssue, VerificationResult
from pydantic import BaseModel


class VerificationRequest(BaseModel):
    verification_job_id: str
    application_id: str
    application_version_id: str
    applicant_user_id: str

    document_signed_url: list[str]


class VerificationResponse(BaseModel):
    verification_job_id: str

    report: VerificationResult
    issues: list[VerificationIssue]
