from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


DocumentType = Literal[
    "application_form_original",
    "applicant_passport_photo",
    "identity_card_copy",
    "business_registration_copy",
    "tenancy_agreement",
    "land_tax_copy",
    "floor_plan",
    "site_plan",
    "business_license_copy",
    "premise_photos",
]


class VerificationDocument(BaseModel):
    application_document_id: UUID
    document_type: DocumentType
    storage_path: str = Field(min_length=1)
    file_name: str = Field(min_length=1)
    file_type: str = Field(min_length=1)
    metadata: dict[str, str] = Field(default_factory=dict)


class VerificationResult(BaseModel):
    confidence_score: float = Field(ge=0, le=100)
    overall_result: Literal["passed", "issues_found", "low_confidence", "failed"]
    manual_fallback_required: bool
    summary: str
    model_version: str
    prompt_policy_version: str
    generated_at: datetime


class VerificationIssue(BaseModel):
    application_document_id: UUID | None = None
    issue_type: Literal[
        "missing_document",
        "invalid_file",
        "unreadable_document",
        "field_mismatch",
        "low_confidence",
        "other",
    ]
    issue_severity: Literal["low", "medium", "high", "critical"]
    field_name: str | None = None
    document_type: DocumentType | None = None
    message: str
    recommended_correction: str
    rule_hit: str
    model_rationale: str | None = None
