from app.verification.rules.base_rule import BaseVerificationRule
from app.verification.schema import VerificationRequest
from app.verification.types import DocumentType, VerificationIssue


REQUIRED_DOCUMENT_TYPES: tuple[DocumentType, ...] = (
    "applicant_passport_photo",
    "identity_card_copy",
    "business_registration_copy",
    "tenancy_agreement",
)


class DocumentTypeCoverageRule(BaseVerificationRule):
    def evaluate(
        self, payload: VerificationRequest
    ) -> list[VerificationIssue]:
        if not payload.documents:
            return []

        supplied_types = {
            document.document_type for document in payload.documents
        }

        return [
            VerificationIssue(
                issue_type="missing_document",
                issue_severity="high",
                document_type=document_type,
                message=f"Required document type '{document_type}' is missing.",
                recommended_correction=(
                    f"Upload a '{document_type}' document and resubmit "
                    "the application."
                ),
                rule_hit=f"document_type_coverage.{document_type}",
            )
            for document_type in REQUIRED_DOCUMENT_TYPES
            if document_type not in supplied_types
        ]
