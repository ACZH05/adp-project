from app.verification.types import (
    VerificationDocument,
    VerificationIssue,
    VerificationResult,
)
from pydantic import BaseModel


class VerificationRequest(BaseModel):
    verification_job_id: str
    application_id: str
    application_version_id: str
    applicant_user_id: str

    form_data: dict[str, object]
    documents: list[VerificationDocument]


class VerificationResponse(BaseModel):
    verification_job_id: str

    report: VerificationResult
    issues: list[VerificationIssue]
