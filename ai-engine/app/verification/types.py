from typing import Literal

from pydantic import BaseModel


class VerificationResult(BaseModel):
    confidence_score: int
    overall_result: Literal["passed", "issues_found", "low_confidence", "failed"]
    summary: str
    model_version: str
    prompt_policy_version: str
    generated_at: str


class VerificationIssue(BaseModel):
    application_document_id: str
    issue_type: Literal[
        "missing_document",
        "invalid_file",
        "unreadable_document",
        "field_mismatch",
        "low_confidence",
        "other",
    ]
    issue_severity: Literal["low", "medium", "high", "critical"]
    field_name: str
    document_type: Literal["application_form_original"]
    message: str
    recommended_correction: str
    rule_hit: str
    model_rationale: str
