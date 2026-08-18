import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SupabaseService } from '../supabase/supabase.service';
import { VerificationJobPayload } from './types/verificationJobPayloadType';
import { VerificationRequestType } from './types/verificationRequestType';
import { VerificationResultType } from './types/verificationResultType';

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

  async process(
    job: Job<VerificationJobPayload, VerificationResultType, string>,
  ) {
    switch (job.name) {
      case 'verify-application': {
        const request =
          await this.mapVerificationJobPayloadToVerificationRequest(job.data);
        console.log(request);
        const result = await this.runVerification(request);
        return result;
      }
    }
  }

  private async runVerification(
    request: VerificationRequestType,
  ): Promise<VerificationResultType> {
    const aiEngineUrl = process.env.AI_ENGINE_URL ?? 'http://127.0.0.1';
    const aiEnginePort = process.env.AI_ENGINE_PORT ?? '8000';
    const response = await fetch(
      `${aiEngineUrl.replace(/\/$/, '')}:${aiEnginePort}/verification/run`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(request),
      },
    );

    if (!response.ok) {
      throw new Error(
        `AI verification failed with ${response.status}: ${await response.text()}`,
      );
    }

    const result = (await response.json()) as VerificationResultType;
    if (result?.report?.generated_at) {
      result.report.generated_at = new Date(result.report.generated_at);
    }
    return result;
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
