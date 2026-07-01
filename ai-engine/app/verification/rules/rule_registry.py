from app.verification.rules.base_rule import BaseVerificationRule
from app.verification.rules.document_type_coverage_rule import (
    DocumentTypeCoverageRule,
)
from app.verification.rules.form_completeness_rule import (
    FormCompletenessRule,
)
from app.verification.rules.required_documents_rule import (
    RequiredDocumentsRule,
)


RULES: tuple[BaseVerificationRule, ...] = (
    RequiredDocumentsRule(),
    DocumentTypeCoverageRule(),
    FormCompletenessRule(),
)
