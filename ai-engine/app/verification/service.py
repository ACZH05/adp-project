from app.verification.schema import (
  VerificationRequest,
  VerificationResponse
)

class VerificationService:
  async def runVerification(self, payload: VerificationRequest):
    return {
      "verification_job_id": payload.verification_job_id,
      "report": {
        "confidence_score": 0,
        "overall_result": "low_confidence",
        "summary": "Not implemented yet",
        "model_version": "dev",
        "prompt_policy_version": "dev",
        "generated_at": ""
      },
      "issues": []
    }