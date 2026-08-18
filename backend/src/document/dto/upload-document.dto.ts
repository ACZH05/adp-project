import { ApiProperty } from '@nestjs/swagger';

export enum UploadDocumentType {
  PASSPORT_PHOTO = 'applicant_passport_photo',
  IDENTITY_CARD = 'identity_card_copy',
  SSM = 'business_registration_copy',
  TENANCY_AGREEMENT = 'tenancy_agreement',
}

export class UploadDocumentDto {
  @ApiProperty({ description: 'The version ID of the application' })
  applicationVersionId!: string;

  @ApiProperty({
    enum: UploadDocumentType,
    description: 'The type of document being uploaded',
  })
  documentType!: UploadDocumentType;

  @ApiProperty({ type: 'string', format: 'binary', description: 'The file to upload' })
  file!: any;
}
