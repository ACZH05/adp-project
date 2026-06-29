jest.mock('../supabase/supabase.service', () => ({
  SupabaseService: class {},
}));

import { VerificationConsumer } from './verification.processor';
import type { SupabaseService } from '../supabase/supabase.service';
import { VerificationJobPayload } from './types/verificationJobPayloadType';

describe('VerificationConsumer', () => {
  const payload: VerificationJobPayload = {
    verification_job_id: 'verification-job-id',
    application_id: 'application-id',
    application_version_id: 'application-version-id',
    applicant_user_id: 'applicant-user-id',
    form_data: {
      fullName: 'Jane Doe',
      icPassport: 'A1234567',
      dob: '1990-01-01',
      email: 'jane@example.com',
      contactNumber: '123456789',
      residentialAddress: '1 Main Street',
      businessName: 'Jane Entertainment',
      position: 'Owner',
      businessPhone: '987654321',
      regDate: new Date('2026-01-01'),
      expiryDate: new Date('2027-01-01'),
      regNumber: 'REG-1',
      businessAddress: '2 Business Street',
      premiseAddress: '3 Premise Street',
      postcode: 50000,
      cityDistrict: 'Kuala Lumpur',
      premiseType: 'Commercial Shop Lot',
      floorLevel: '1',
      primaryType: 'Live Music/Band Performance',
      quantityCapacity: 100,
      quantityUnit: 'Pax/Persons',
      requestedDuration: 12,
      operatingHoursStart: 10,
      operatingHoursEnd: 22,
      signatoryName: 'Jane Doe',
      signatoryIc: 'A1234567',
      companyName: 'Jane Entertainment Sdn Bhd',
      acceptedDeclaration: true,
    },
    document_refs: [
      {
        application_document_id: 'document-id',
        document_type: 'identity_card_copy',
        storage_path: 'documents/ic.pdf',
        file_name: 'ic.pdf',
        file_type: 'application/pdf',
      },
    ],
  };

  it('maps job payload document refs to signed request document refs', async () => {
    const supabaseService = {
      createSignedDocumentUrl: jest.fn().mockResolvedValue([
        {
          path: 'documents/ic.pdf',
          signedUrl: 'https://signed.example/documents/ic.pdf',
        },
      ]),
    } as unknown as SupabaseService;
    const consumer = new VerificationConsumer(supabaseService);

    const request = await (
      consumer as unknown as {
        mapVerificationJobPayloadToVerificationRequest: (
          data: VerificationJobPayload,
        ) => Promise<unknown>;
      }
    ).mapVerificationJobPayloadToVerificationRequest(payload);

    expect(supabaseService.createSignedDocumentUrl).toHaveBeenCalledWith(
      payload,
    );
    expect(request).toEqual({
      ...payload,
      document_refs: [
        {
          ...payload.document_refs[0],
          signed_url: 'https://signed.example/documents/ic.pdf',
        },
      ],
    });
  });

  it('throws when a document is missing its signed URL', async () => {
    const supabaseService = {
      createSignedDocumentUrl: jest.fn().mockResolvedValue([]),
    } as unknown as SupabaseService;
    const consumer = new VerificationConsumer(supabaseService);

    await expect(
      (
        consumer as unknown as {
          mapVerificationJobPayloadToVerificationRequest: (
            data: VerificationJobPayload,
          ) => Promise<unknown>;
        }
      ).mapVerificationJobPayloadToVerificationRequest(payload),
    ).rejects.toThrow('Missing signed URL for document: documents/ic.pdf');
  });
});
