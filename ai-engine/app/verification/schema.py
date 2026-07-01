from uuid import UUID

from app.verification.types import (
    FormData,
    VerificationDocument,
    VerificationIssue,
    VerificationResult,
)
from pydantic import BaseModel


class VerificationRequest(BaseModel):
    verification_job_id: UUID
    application_id: UUID
    application_version_id: UUID
    applicant_user_id: UUID

    form_data: FormData
    document_refs: list[VerificationDocument]


class VerificationResponse(BaseModel):
    verification_job_id: UUID

    report: VerificationResult
    issues: list[VerificationIssue]
