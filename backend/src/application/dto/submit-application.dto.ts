import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitApplicationDto {
  @ApiPropertyOptional({ description: 'Existing application ID if updating' })
  applicationId?: string;

  @ApiPropertyOptional({ description: 'Existing application version ID if updating' })
  applicationVersionId?: string;

  @ApiProperty({ example: 'Test User' })
  fullName!: string;

  @ApiProperty({ example: 'A1234567' })
  icPassport!: string;

  @ApiProperty({ example: '1990-01-01' })
  dob!: string;

  @ApiProperty({ example: 'test@example.com' })
  email!: string;

  @ApiProperty({ example: '0123456789' })
  contactNumber!: string;

  @ApiProperty({ example: '1 Test Road' })
  residentialAddress!: string;

  @ApiProperty({ example: 'Test Business' })
  businessName!: string;

  @ApiProperty({ example: 'Owner' })
  position!: string;

  @ApiProperty({ example: '0312345678' })
  businessPhone!: string;

  @ApiProperty({ example: '2026-01-01' })
  regDate!: string;

  @ApiProperty({ example: '2027-01-01' })
  expiryDate!: string;

  @ApiProperty({ example: 'REG123' })
  regNumber!: string;

  @ApiProperty({ example: '2 Business Road' })
  businessAddress!: string;

  @ApiProperty({ example: '3 Premise Road' })
  premiseAddress!: string;

  @ApiProperty({ example: 50000 })
  postcode!: number;

  @ApiProperty({ example: 'Kuala Lumpur' })
  cityDistrict!: string;

  @ApiProperty({ example: 'Commercial Shop Lot' })
  premiseType!: string;

  @ApiProperty({ example: 'Ground' })
  floorLevel!: string;

  @ApiProperty({ example: 'Live Music/Band Performance' })
  primaryType!: string;

  @ApiProperty({ example: 100 })
  quantityCapacity!: number;

  @ApiProperty({ example: 'Pax/Persons' })
  quantityUnit!: string;

  @ApiProperty({ example: 12 })
  requestedDuration!: number;

  @ApiProperty({ example: 10 })
  operatingHoursStart!: number;

  @ApiProperty({ example: 22 })
  operatingHoursEnd!: number;

  @ApiProperty({ example: 'Test User' })
  signatoryName!: string;

  @ApiProperty({ example: 'A1234567' })
  signatoryIc!: string;

  @ApiProperty({ example: 'Test Business Sdn Bhd' })
  companyName!: string;

  @ApiProperty({ example: true })
  acceptedDeclaration!: boolean;
}
