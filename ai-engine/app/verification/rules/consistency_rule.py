from app.verification.rules.base_rule import BaseVerificationRule
from app.verification.schema import VerificationRequest
from app.verification.types import (
    DocumentType,
    VerificationDocument,
    VerificationIssue,
)


FIELD_MAPPINGS: dict[DocumentType, tuple[tuple[str, str], ...]] = {
    "identity_card_copy": (
        ("full_name", "fullName"),
        ("identity_number", "icPassport"),
    ),
    "business_registration_copy": (
        ("business_name", "businessName"),
        ("registration_number", "regNumber"),
        ("business_address", "businessAddress"),
    ),
    "tenancy_agreement": (
        ("premise_address", "premiseAddress"),
    ),
}


class ConsistencyRule(BaseVerificationRule):
    def evaluate(
        self, payload: VerificationRequest
    ) -> list[VerificationIssue]:
        issues: list[VerificationIssue] = []

        for document in payload.documents:
            issues.extend(self._check_document(document, payload.form_data))

        return issues

    def _check_document(
        self,
        document: VerificationDocument,
        form_data: dict[str, object],
    ) -> list[VerificationIssue]:
        issues: list[VerificationIssue] = []

        for metadata_field, form_field in FIELD_MAPPINGS.get(
            document.document_type, ()
        ):
            metadata_value = document.metadata.get(metadata_field)
            form_value = form_data.get(form_field)

            if not metadata_value or form_value is None:
                continue
            if self._normalize(metadata_value) == self._normalize(form_value):
                continue

            issues.append(
                VerificationIssue(
                    application_document_id=(
                        document.application_document_id
                    ),
                    issue_type="field_mismatch",
                    issue_severity="medium",
                    field_name=form_field,
                    document_type=document.document_type,
                    message=(
                        f"Form field '{form_field}' does not match "
                        f"document metadata field '{metadata_field}'."
                    ),
                    recommended_correction=(
                        "Correct the form value or upload a document "
                        "with matching metadata."
                    ),
                    rule_hit=(
                        f"consistency.{document.document_type}."
                        f"{metadata_field}"
                    ),
                )
            )

        return issues

    @staticmethod
    def _normalize(value: object) -> str:
        return "".join(
            character
            for character in str(value).casefold()
            if character.isalnum()
        )
