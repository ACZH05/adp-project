import type { VerificationRequestType } from './verificationRequestType';

export type VerificationJobPayload = {
  verification_job_id: string;
  application_id: string;
  application_version_id: string;
  applicant_user_id: string;
  form_data: VerificationRequestType['form_data'];
  document_refs: {
    application_document_id: string;
    document_type: VerificationRequestType['document_refs'][number]['document_type'];
    storage_path: string;
    file_name: string;
    file_type: string;
  }[];
};
