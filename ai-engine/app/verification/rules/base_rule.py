from abc import ABC, abstractmethod

from app.verification.schema import VerificationRequest
from app.verification.types import VerificationIssue


class BaseVerificationRule(ABC):
    @abstractmethod
    def evaluate(
        self, payload: VerificationRequest
    ) -> list[VerificationIssue]:
        pass
