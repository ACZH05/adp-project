import type { VerificationRequestType } from './verificationRequestType';

type DocumentType = VerificationRequestType['document_refs'][number]['document_type'];

type VerificationOverallResult =
  | 'passed'
  | 'issues_found'
  | 'low_confidence'
  | 'failed';

type VerificationIssueType =
  | 'missing_document'
  | 'invalid_file'
  | 'unreadable_document'
  | 'field_mismatch'
  | 'low_confidence'
  | 'other';

type VerificationIssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export type VerificationResultType = {
  verification_job_id: string;
  report: {
    confidence_score: number;
    overall_result: VerificationOverallResult;
    manual_fallback_required: boolean;
    summary: string;
    model_version: string;
    prompt_policy_version: string;
    generated_at: Date;
  };
  issues: {
    application_document_id: string | null;
    issue_type: VerificationIssueType;
    issue_severity: VerificationIssueSeverity;
    field_name: string | null;
    document_type: DocumentType | null;
    message: string;
    recommended_correction: string;
    rule_hit: string;
    model_rationale: string | null;
  }[];
};
