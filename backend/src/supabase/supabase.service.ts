import { Injectable, HttpException, InternalServerErrorException } from '@nestjs/common';
import { VerificationJobPayload } from 'src/verification/types/verificationJobPayloadType';
import { supabase } from '../../supabase/supabase';

@Injectable()
export class SupabaseService {
  private handleSupabaseError(error: any) {
    if (!error) return;
    const statusStr = error.status || error.statusCode || error.code;
    const status = statusStr ? parseInt(String(statusStr), 10) : 500;
    const message = error.message || 'Supabase Storage error occurred';

    if (isNaN(status) || status < 100 || status > 599) {
      throw new InternalServerErrorException(message);
    }

    throw new HttpException(message, status);
  }

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
      this.handleSupabaseError(error);
    }
    return data;
  }

  async deleteFile(bucket: string, path: string): Promise<any> {
    const { data, error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      this.handleSupabaseError(error);
    }
    return data;
  }

  async createSingleSignedUrl(bucket: string, path: string): Promise<any> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(
        path,
        Number(process.env.SUPABASE_SIGNED_URL_EXPIRES_SECONDS ?? 3600),
      );
    if (error) {
      this.handleSupabaseError(error);
    }
    return data;
  }
}
