type PremiseType =
  | 'Commercial Shop Lot'
  | 'Shopping Mall Unit'
  | 'Hotel/Resort'
  | 'Industrial Warehouse'
  | 'Open Space/Outdoor'
  | 'Other';

type PrimaryEntertainmentType =
  | 'Live Music/Band Performance'
  | 'DJ Performance/Dance Club'
  | 'Karaoke Louge'
  | 'Arcade & Gaming Center'
  | 'Theater & Cinema'
  | 'Exhibition & Public Show'
  | 'Other';

type CapacityUnit =
  | 'Pax/Persons'
  | 'Tables'
  | 'Devices/Stations'
  | 'Rooms/Booths';

type DocumentType =
  | 'application_form_original'
  | 'applicant_passport_photo'
  | 'identity_card_copy'
  | 'business_registration_copy'
  | 'tenancy_agreement'
  | 'land_tax_copy'
  | 'floor_plan'
  | 'site_plan'
  | 'business_license_copy'
  | 'premise_photos';

type FormData = {
  fullName: string;
  icPassport: string;
  dob: string;
  email: string;
  contactNumber: string;
  residentialAddress: string;
  businessName: string;
  position: string;
  businessPhone: string;
  regDate: string;
  expiryDate: string;
  regNumber: string;
  businessAddress: string;
  premiseAddress: string;
  postcode: number;
  cityDistrict: string;
  premiseType: PremiseType;
  floorLevel: string;
  primaryType: PrimaryEntertainmentType;
  quantityCapacity: number;
  quantityUnit: CapacityUnit;
  requestedDuration: number;
  operatingHoursStart: number;
  operatingHoursEnd: number;
  signatoryName: string;
  signatoryIc: string;
  companyName: string;
  acceptedDeclaration: boolean;
};

export type VerificationRequestType = {
  verification_job_id: string;
  application_id: string;
  application_version_id: string;
  applicant_user_id: string;
  form_data: FormData;
  document_refs: {
    application_document_id: string;
    document_type: DocumentType;
    storage_path: string;
    file_name: string;
    file_type: string;
    signed_url: string;
  }[];
};
