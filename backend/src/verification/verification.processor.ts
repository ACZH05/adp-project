import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationJobPayload } from './types/verificationJobPayloadType';
import { VerificationRequestType } from './types/verificationRequestType';
import { VerificationResultType } from './types/verificationResultType';
import {
  VerificationJobStatus,
  ApplicationStatus,
} from '../../generated/prisma/client';

import { NotificationService } from '../notification/notification.service';

type SignedDocumentUrl = {
  path?: string | null;
  signedUrl?: string | null;
  signed_url?: string | null;
};

@Processor('verification')
export class VerificationConsumer extends WorkerHost {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {
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
        try {
          const result = await this.runVerification(request);

          await this.saveVerificationResult(
            job.data.application_version_id,
            job.data.application_id,
            result,
          );

          return result;
        } catch (error) {
          console.error('Job verification failed:', error);
          await this.saveVerificationFailure(
            job.data.application_version_id,
            job.data.application_id,
            error,
          );
          throw error;
        }
      }
    }
  }

  private async saveVerificationResult(
    applicationVersionId: string,
    applicationId: string,
    result: VerificationResultType,
  ) {
    if (!this.prisma || typeof this.prisma.$transaction !== 'function') return;

    const overallResult = result.report.overall_result;

    // 1. Map overall AI result to database Application status
    let appStatus: ApplicationStatus = ApplicationStatus.correction_required;
    if (overallResult === 'passed') {
      appStatus = ApplicationStatus.verification_complete;
    } else if (overallResult === 'failed') {
      appStatus = ApplicationStatus.rejected;
    }

    // 2. Perform transactional database updates
    await this.prisma.$transaction(async (tx) => {
      // Find latest active queued verification job
      const dbJob = await tx.verificationJob.findFirst({
        where: {
          applicationVersionId,
          jobStatus: VerificationJobStatus.queued,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (dbJob) {
        // Mark job as completed
        await tx.verificationJob.update({
          where: { id: dbJob.id },
          data: {
            jobStatus: VerificationJobStatus.success,
            completedAt: new Date(),
          },
        });

        // Save verification report
        const report = await tx.verificationReport.create({
          data: {
            verificationJobId: dbJob.id,
            confidenceScore: result.report.confidence_score,
            overallResult: result.report.overall_result as any,
            manualFallbackRequired: result.report.manual_fallback_required,
            summary: result.report.summary,
            modelVersion: result.report.model_version,
            promptPolicyVersion: result.report.prompt_policy_version,
            generatedAt: new Date(result.report.generated_at),
            rawResult: JSON.parse(JSON.stringify(result)),
          },
        });

        // Insert report issues
        if (result.issues && result.issues.length > 0) {
          for (const issue of result.issues) {
            await tx.verificationIssue.create({
              data: {
                verificationReportId: report.id,
                applicationDocumentId: issue.application_document_id || undefined,
                issueType: issue.issue_type as any,
                issueSeverity: issue.issue_severity as any,
                fieldName: issue.field_name,
                documentType: issue.document_type as any,
                message: issue.message,
                recommendedCorrection: issue.recommended_correction,
                ruleHit: issue.rule_hit,
                modelRationale: issue.model_rationale,
              },
            });
          }
        }
      }

      // Transition the overall Application status
      await tx.application.update({
        where: { id: applicationId },
        data: {
          status: appStatus,
        },
      });
    }, { maxWait: 10000, timeout: 20000 });

    // 3. Dispatch Email Notification (S2-FR-11)
    try {
      const app = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: { applicant: true },
      });

      if (app && app.applicant?.email && this.notificationService) {
        await this.notificationService.sendApplicationStatusNotification({
          recipientEmail: app.applicant.email,
          applicantName: app.applicantFullName,
          applicationNo: app.applicationNo,
          status: appStatus,
          summary: result.report.summary,
          issuesCount: result.issues?.length ?? 0,
        });
      }
    } catch (notifErr) {
      console.error('Failed to dispatch status email notification:', notifErr);
    }
  }

  private async saveVerificationFailure(
    applicationVersionId: string,
    applicationId: string,
    error: any,
  ) {
    if (!this.prisma || typeof this.prisma.$transaction !== 'function') return;

    await this.prisma.$transaction(async (tx) => {
      const dbJob = await tx.verificationJob.findFirst({
        where: {
          applicationVersionId,
          jobStatus: VerificationJobStatus.queued,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (dbJob) {
        await tx.verificationJob.update({
          where: { id: dbJob.id },
          data: {
            jobStatus: VerificationJobStatus.failed,
            failureReason: error?.message || String(error),
            completedAt: new Date(),
          },
        });
      }

      await tx.application.update({
        where: { id: applicationId },
        data: {
          status: ApplicationStatus.correction_required,
        },
      });
    });
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
