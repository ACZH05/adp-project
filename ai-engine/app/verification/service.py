from datetime import datetime, timezone

from app.verification.rules.rule_registry import RULES
from app.verification.schema import VerificationRequest, VerificationResponse
from app.verification.types import VerificationIssue, VerificationResult


class VerificationService:
    async def runVerification(
        self, payload: VerificationRequest
    ) -> VerificationResponse:
        issues = [
            issue
            for rule in RULES
            for issue in rule.evaluate(payload)
        ]

        return VerificationResponse(
            verification_job_id=payload.verification_job_id,
            report=VerificationResult(
                confidence_score=100.0,
                overall_result="issues_found" if issues else "passed",
                manual_fallback_required=False,
                summary=self._build_summary(issues),
                model_version="rules-mvp-v1",
                prompt_policy_version="not-applicable",
                generated_at=datetime.now(timezone.utc),
            ),
            issues=issues,
        )

    @staticmethod
    def _build_summary(issues: list[VerificationIssue]) -> str:
        if not issues:
            return (
                "All required documents, form fields, and metadata "
                "consistency checks passed."
            )

        incomplete_fields = sum(
            issue.rule_hit.startswith("form_completeness.")
            for issue in issues
        )
        document_issues = sum(
            issue.issue_type == "missing_document"
            for issue in issues
        )
        consistency_issues = sum(
            issue.issue_type == "field_mismatch"
            for issue in issues
        )

        return (
            f"Rule-based verification found {len(issues)} issue(s): "
            f"{incomplete_fields} incomplete form field(s), "
            f"{document_issues} document issue(s), and "
            f"{consistency_issues} consistency issue(s)."
        )
