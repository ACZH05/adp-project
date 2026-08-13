from uuid import UUID

from app.verification.rules.document_type_coverage_rule import (
    DocumentTypeCoverageRule,
)
from app.verification.rules.form_completeness_rule import FormCompletenessRule
from app.verification.rules.required_documents_rule import RequiredDocumentsRule
from app.verification.schema import VerificationRequest


FORM_DATA = {
    "fullName": "Test User",
    "icPassport": "A1234567",
    "dob": "1990-01-01",
    "email": "test@example.com",
    "contactNumber": "0123456789",
    "residentialAddress": "1 Test Road",
    "businessName": "Test Business",
    "position": "Owner",
    "businessPhone": "0312345678",
    "regDate": "2026-01-01",
    "expiryDate": "2027-01-01",
    "regNumber": "REG123",
    "businessAddress": "2 Business Road",
    "premiseAddress": "3 Premise Road",
    "postcode": 50000,
    "cityDistrict": "Kuala Lumpur",
    "premiseType": "Commercial Shop Lot",
    "floorLevel": "Ground",
    "primaryType": "Live Music/Band Performance",
    "quantityCapacity": 100,
    "quantityUnit": "Pax/Persons",
    "requestedDuration": 12,
    "operatingHoursStart": 10,
    "operatingHoursEnd": 22,
    "signatoryName": "Test User",
    "signatoryIc": "A1234567",
    "companyName": "Test Business Sdn Bhd",
    "acceptedDeclaration": True,
}


def build_request(document_refs):
    return VerificationRequest(
        verification_job_id="00000000-0000-0000-0000-000000000001",
        application_id="00000000-0000-0000-0000-000000000002",
        application_version_id="00000000-0000-0000-0000-000000000003",
        applicant_user_id="00000000-0000-0000-0000-000000000004",
        form_data=FORM_DATA,
        document_refs=document_refs,
    )


def test_request_shape_and_rules():
    payload = build_request(
        [
            {
                "application_document_id": "00000000-0000-0000-0000-000000000005",
                "document_type": "identity_card_copy",
                "storage_path": "documents/ic.pdf",
                "file_name": "ic.pdf",
                "file_type": "application/pdf",
                "signed_url": "https://example.com/ic.pdf",
            }
        ]
    )

    assert isinstance(payload.verification_job_id, UUID)
    assert isinstance(payload.document_refs[0].application_document_id, UUID)
    assert not hasattr(payload, "documents")
    assert RequiredDocumentsRule().evaluate(payload) == []
    assert FormCompletenessRule().evaluate(payload) == []

    issues = DocumentTypeCoverageRule().evaluate(payload)
    assert {issue.document_type for issue in issues} == {
        "applicant_passport_photo",
        "business_registration_copy",
        "tenancy_agreement",
    }


def test_empty_document_refs_reports_new_field_name():
    issue = RequiredDocumentsRule().evaluate(build_request([]))[0]
    assert issue.field_name == "document_refs"


if __name__ == "__main__":
    test_request_shape_and_rules()
    test_empty_document_refs_reports_new_field_name()
