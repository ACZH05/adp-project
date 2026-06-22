export type VerificationJobPayload = {
  verification_job_id: string;
  application_id: string;
  application_version_id: string;
  applicant_user_id: string;
  document_refs: {
    application_document_id: string;
    document_type: string;
    storage_path: string;
    file_name: string;
    file_type: string;
  }[];
};
