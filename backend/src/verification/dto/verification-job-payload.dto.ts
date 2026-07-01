import { ApiProperty } from '@nestjs/swagger';
import type { VerificationJobPayload } from '../types/verificationJobPayloadType';

const premiseTypes = [
  'Commercial Shop Lot',
  'Shopping Mall Unit',
  'Hotel/Resort',
  'Industrial Warehouse',
  'Open Space/Outdoor',
  'Other',
] as const;

const primaryEntertainmentTypes = [
  'Live Music/Band Performance',
  'DJ Performance/Dance Club',
  'Karaoke Louge',
  'Arcade & Gaming Center',
  'Theater & Cinema',
  'Exhibition & Public Show',
  'Other',
] as const;

const capacityUnits = [
  'Pax/Persons',
  'Tables',
  'Devices/Stations',
  'Rooms/Booths',
] as const;

const documentTypes = [
  'application_form_original',
  'applicant_passport_photo',
  'identity_card_copy',
  'business_registration_copy',
  'tenancy_agreement',
  'land_tax_copy',
  'floor_plan',
  'site_plan',
  'business_license_copy',
  'premise_photos',
] as const;

class VerificationFormDataDto {
  @ApiProperty()
  fullName!: string;

  @ApiProperty()
  icPassport!: string;

  @ApiProperty({ format: 'date' })
  dob!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  contactNumber!: string;

  @ApiProperty()
  residentialAddress!: string;

  @ApiProperty()
  businessName!: string;

  @ApiProperty()
  position!: string;

  @ApiProperty()
  businessPhone!: string;

  @ApiProperty({ format: 'date-time' })
  regDate!: Date;

  @ApiProperty({ format: 'date-time' })
  expiryDate!: Date;

  @ApiProperty()
  regNumber!: string;

  @ApiProperty()
  businessAddress!: string;

  @ApiProperty()
  premiseAddress!: string;

  @ApiProperty()
  postcode!: number;

  @ApiProperty()
  cityDistrict!: string;

  @ApiProperty({ enum: premiseTypes })
  premiseType!: VerificationJobPayload['form_data']['premiseType'];

  @ApiProperty()
  floorLevel!: string;

  @ApiProperty({ enum: primaryEntertainmentTypes })
  primaryType!: VerificationJobPayload['form_data']['primaryType'];

  @ApiProperty()
  quantityCapacity!: number;

  @ApiProperty({ enum: capacityUnits })
  quantityUnit!: VerificationJobPayload['form_data']['quantityUnit'];

  @ApiProperty()
  requestedDuration!: number;

  @ApiProperty()
  operatingHoursStart!: number;

  @ApiProperty()
  operatingHoursEnd!: number;

  @ApiProperty()
  signatoryName!: string;

  @ApiProperty()
  signatoryIc!: string;

  @ApiProperty()
  companyName!: string;

  @ApiProperty()
  acceptedDeclaration!: boolean;
}

class VerificationDocumentRefDto {
  @ApiProperty()
  application_document_id!: string;

  @ApiProperty({ enum: documentTypes })
  document_type!: VerificationJobPayload['document_refs'][number]['document_type'];

  @ApiProperty()
  storage_path!: string;

  @ApiProperty()
  file_name!: string;

  @ApiProperty()
  file_type!: string;
}

export class VerificationJobPayloadDto implements VerificationJobPayload {
  @ApiProperty()
  verification_job_id!: string;

  @ApiProperty()
  application_id!: string;

  @ApiProperty()
  application_version_id!: string;

  @ApiProperty()
  applicant_user_id!: string;

  @ApiProperty({ type: VerificationFormDataDto })
  form_data!: VerificationJobPayload['form_data'];

  @ApiProperty({ type: [VerificationDocumentRefDto] })
  document_refs!: VerificationJobPayload['document_refs'];
}
