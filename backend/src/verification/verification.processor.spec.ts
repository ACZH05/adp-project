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
      regDate: '2026-01-01',
      expiryDate: '2027-01-01',
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
    const consumer = new VerificationConsumer(supabaseService, {} as any);

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
    const consumer = new VerificationConsumer(supabaseService, {} as any);

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

  it('posts signed verification request to the AI engine', async () => {
    process.env.AI_ENGINE_URL = 'http://localhost';
    process.env.AI_ENGINE_PORT = '8000';

    const supabaseService = {
      createSignedDocumentUrl: jest.fn().mockResolvedValue([
        {
          path: 'documents/ic.pdf',
          signedUrl: 'https://signed.example/documents/ic.pdf',
        },
      ]),
    } as unknown as SupabaseService;
    const aiResponse = {
      verification_job_id: payload.verification_job_id,
      report: {
        confidence_score: 100,
        overall_result: 'passed',
        manual_fallback_required: false,
        summary: 'All required documents and form field checks passed.',
        model_version: 'rules-mvp-v1',
        prompt_policy_version: 'not-applicable',
        generated_at: '2026-06-29T09:00:00.000Z',
      },
      issues: [
        {
          application_document_id: null,
          issue_type: 'missing_document',
          issue_severity: 'medium',
          field_name: 'document_refs',
          document_type: 'tenancy_agreement',
          message: 'Missing tenancy agreement.',
          recommended_correction: 'Upload tenancy agreement.',
          rule_hit: 'required_documents.tenancy_agreement',
          model_rationale: null,
        },
      ],
    };
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(aiResponse),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const consumer = new VerificationConsumer(supabaseService, {} as any);
    const result = await consumer.process({
      name: 'verify-application',
      data: payload,
    } as never);

    expect(result).toEqual({
      ...aiResponse,
      report: {
        ...aiResponse.report,
        generated_at: new Date(aiResponse.report.generated_at),
      },
    });
    expect(result?.report.generated_at).toBeInstanceOf(Date);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/verification/run',
      expect.objectContaining({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: expect.any(String),
      }),
    );

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as VerificationJobPayload & {
      document_refs: { signed_url: string }[];
    };
    expect(body.document_refs[0].signed_url).toBe(
      'https://signed.example/documents/ic.pdf',
    );
  });

  it('throws when the AI engine rejects verification', async () => {
    const supabaseService = {
      createSignedDocumentUrl: jest.fn().mockResolvedValue([
        {
          path: 'documents/ic.pdf',
          signedUrl: 'https://signed.example/documents/ic.pdf',
        },
      ]),
    } as unknown as SupabaseService;
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 502,
      text: jest.fn().mockResolvedValue('bad gateway'),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const consumer = new VerificationConsumer(supabaseService, {} as any);

    await expect(
      consumer.process({ name: 'verify-application', data: payload } as never),
    ).rejects.toThrow('AI verification failed with 502: bad gateway');
  });
});
