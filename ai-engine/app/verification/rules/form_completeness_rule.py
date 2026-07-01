from app.verification.rules.base_rule import BaseVerificationRule
from app.verification.schema import VerificationRequest
from app.verification.types import VerificationIssue


REQUIRED_FORM_FIELDS = (
    "fullName",
    "icPassport",
    "dob",
    "email",
    "contactNumber",
    "residentialAddress",
    "businessName",
    "position",
    "businessPhone",
    "regDate",
    "expiryDate",
    "regNumber",
    "businessAddress",
    "premiseAddress",
    "postcode",
    "cityDistrict",
    "premiseType",
    "floorLevel",
    "primaryType",
    "quantityCapacity",
    "quantityUnit",
    "requestedDuration",
    "operatingHoursStart",
    "operatingHoursEnd",
    "signatoryName",
    "signatoryIc",
    "companyName",
    "acceptedDeclaration",
)


class FormCompletenessRule(BaseVerificationRule):
    def evaluate(
        self, payload: VerificationRequest
    ) -> list[VerificationIssue]:
        return [
            VerificationIssue(
                issue_type="other",
                issue_severity="medium",
                field_name=field_name,
                message=f"Required form field '{field_name}' is incomplete.",
                recommended_correction=(
                    f"Provide a value for '{field_name}' and resubmit "
                    "the application."
                ),
                rule_hit=f"form_completeness.{field_name}",
            )
            for field_name in REQUIRED_FORM_FIELDS
            if self._is_missing(getattr(payload.form_data, field_name))
        ]

    @staticmethod
    def _is_missing(value: object) -> bool:
        if value is None or value is False:
            return True
        if isinstance(value, str):
            return not value.strip()
        if isinstance(value, (list, dict, tuple, set)):
            return not value
        return False
