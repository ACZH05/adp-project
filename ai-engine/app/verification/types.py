from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field

PremiseType = Literal[
    "Commercial Shop Lot",
    "Shopping Mall Unit",
    "Hotel/Resort",
    "Industrial Warehouse",
    "Open Space/Outdoor",
    "Other",
]

PrimaryEntertainmentType = Literal[
    "Live Music/Band Performance",
    "DJ Performance/Dance Club",
    "Karaoke Louge",
    "Arcade & Gaming Center",
    "Theater & Cinema",
    "Exhibition & Public Show",
    "Other",
]

CapacityUnit = Literal[
    "Pax/Persons",
    "Tables",
    "Devices/Stations",
    "Rooms/Booths",
]

DocumentType = Literal[
    "application_form_original",
    "applicant_passport_photo",
    "identity_card_copy",
    "business_registration_copy",
    "tenancy_agreement",
    "land_tax_copy",
    "floor_plan",
    "site_plan",
    "business_license_copy",
    "premise_photos",
]


class FormData(BaseModel):
    fullName: str
    icPassport: str
    dob: str
    email: str
    contactNumber: str
    residentialAddress: str
    businessName: str
    position: str
    businessPhone: str
    regDate: date
    expiryDate: date | None = None
    regNumber: str
    businessAddress: str
    premiseAddress: str
    postcode: int
    cityDistrict: str
    premiseType: PremiseType
    floorLevel: str
    primaryType: PrimaryEntertainmentType
    quantityCapacity: int
    quantityUnit: CapacityUnit
    requestedDuration: int
    operatingHoursStart: int
    operatingHoursEnd: int
    signatoryName: str
    signatoryIc: str
    companyName: str
    acceptedDeclaration: bool


class VerificationDocument(BaseModel):
    application_document_id: UUID
    document_type: DocumentType
    storage_path: str = Field(min_length=1)
    file_name: str = Field(min_length=1)
    file_type: str = Field(min_length=1)
    signed_url: str


class VerificationResult(BaseModel):
    confidence_score: float = Field(ge=0, le=100)
    overall_result: Literal["passed", "issues_found", "low_confidence", "failed"]
    manual_fallback_required: bool
    summary: str
    model_version: str
    prompt_policy_version: str
    generated_at: datetime


class VerificationIssue(BaseModel):
    application_document_id: UUID | None = None
    issue_type: Literal[
        "missing_document",
        "invalid_file",
        "unreadable_document",
        "field_mismatch",
        "low_confidence",
        "other",
    ]
    issue_severity: Literal["low", "medium", "high", "critical"]
    field_name: str | None = None
    document_type: DocumentType | None = None
    message: str
    recommended_correction: str
    rule_hit: str
    model_rationale: str | None = None
