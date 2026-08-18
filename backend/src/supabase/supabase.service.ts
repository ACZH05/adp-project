import { Injectable } from '@nestjs/common';
import { VerificationJobPayload } from 'src/verification/types/verificationJobPayloadType';
import { supabase } from '../../supabase/supabase';

@Injectable()
export class SupabaseService {
  async createSignedDocumentUrl(payload: VerificationJobPayload) {
    const paths = payload.document_refs.map((data) => {
      return data.storage_path;
    });
    const { data } = await supabase.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET ?? 'application-documents')
      .createSignedUrls(
        paths,
        Number(process.env.SUPABASE_SIGNED_URL_EXPIRES_SECONDS ?? 3600),
      );
    return data;
  }

  async uploadFile(bucket: string, path: string, fileBuffer: Buffer, mimeType: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      throw error;
    }
    return data;
  }
}
