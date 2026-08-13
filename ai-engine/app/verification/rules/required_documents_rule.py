from app.verification.rules.base_rule import BaseVerificationRule
from app.verification.schema import VerificationRequest
from app.verification.types import VerificationIssue


class RequiredDocumentsRule(BaseVerificationRule):
    def evaluate(
        self, payload: VerificationRequest
    ) -> list[VerificationIssue]:
        if payload.document_refs:
            return []

        return [
            VerificationIssue(
                issue_type="missing_document",
                issue_severity="high",
                field_name="document_refs",
                message="No documents were supplied for verification.",
                recommended_correction=(
                    "Upload the required documents and resubmit "
                    "the application."
                ),
                rule_hit="required_documents.present",
            )
        ]
