import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SupabaseService } from '../supabase/supabase.service';
import { VerificationJobPayload } from './types/verificationJobPayloadType';
import { VerificationRequestType } from './types/verificationRequestType';

type SignedDocumentUrl = {
  path?: string | null;
  signedUrl?: string | null;
  signed_url?: string | null;
};

@Processor('verification')
export class VerificationConsumer extends WorkerHost {
  constructor(private readonly supabaseService: SupabaseService) {
    super();
  }

  async process(job: Job<VerificationJobPayload, void, string>) {
    switch (job.name) {
      case 'verify-application': {
        const request =
          await this.mapVerificationJobPayloadToVerificationRequest(job.data);
        console.log('Job Data :', request);
      }
    }
  }

  private async mapVerificationJobPayloadToVerificationRequest(
    payload: VerificationJobPayload,
  ): Promise<VerificationRequestType> {
    const signedUrls =
      await this.supabaseService.createSignedDocumentUrl(payload);
    const signedUrlByPath = new Map<string, string>();

    signedUrls?.forEach((data: SignedDocumentUrl) => {
      const signedUrl = data.signedUrl ?? data.signed_url;

      if (data.path && signedUrl) {
        signedUrlByPath.set(data.path, signedUrl);
      }
    });

    return {
      ...payload,
      document_refs: payload.document_refs.map((document) => {
        const signed_url = signedUrlByPath.get(document.storage_path);

        if (!signed_url) {
          throw new Error(
            `Missing signed URL for document: ${document.storage_path}`,
          );
        }

        return {
          ...document,
          signed_url,
        };
      }),
    };
  }
}
