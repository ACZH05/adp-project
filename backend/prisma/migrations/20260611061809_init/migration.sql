-- CreateEnum
CREATE TYPE "application_status" AS ENUM ('draft', 'submitted', 'verification_queued', 'verification_in_progress', 'verification_complete', 'pending_officer_review', 'manual_prescreening_required', 'correction_required', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "application_version_status" AS ENUM ('draft', 'submitted', 'superseded');

-- CreateEnum
CREATE TYPE "officer_decision_type" AS ENUM ('approved', 'rejected', 'correction_required');

-- CreateEnum
CREATE TYPE "premise_type" AS ENUM ('mall', 'hotel', 'resort', 'hall', 'corner_shop', 'middle_shop', 'warehouse', 'other');

-- CreateEnum
CREATE TYPE "floor_level" AS ENUM ('upper', 'ground', 'mezzanine', 'parking', 'other');

-- CreateEnum
CREATE TYPE "entertainment_type" AS ENUM ('dance', 'live_band', 'karaoke', 'amusement', 'cinema', 'kiddy_rides', 'simulator_bounce_play', 'laser_disc', 'bowling', 'snooker_billiard_pool');

-- CreateEnum
CREATE TYPE "appointment_status" AS ENUM ('pending', 'approved', 'rejected', 'unavailable');

-- CreateEnum
CREATE TYPE "audit_action" AS ENUM ('login', 'submit_application', 'upload_document', 'run_verification', 'officer_decision', 'appointment_decision', 'notification_sent');

-- CreateEnum
CREATE TYPE "kpi_event_type" AS ENUM ('application_submitted', 'verification_completed', 'correction_required', 'approved', 'rejected', 'appointment_requested', 'appointment_decided');

-- CreateEnum
CREATE TYPE "document_type" AS ENUM ('application_form_original', 'applicant_passport_photo', 'identity_card_copy', 'business_registration_copy', 'tenancy_agreement', 'land_tax_copy', 'floor_plan', 'site_plan', 'business_license_copy', 'premise_photos');

-- CreateEnum
CREATE TYPE "document_upload_status" AS ENUM ('uploaded', 'replaced', 'removed');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('applicant', 'officer', 'admin');

-- CreateEnum
CREATE TYPE "account_status" AS ENUM ('active', 'invited', 'suspended', 'disabled');

-- CreateEnum
CREATE TYPE "admin_invitation_role" AS ENUM ('officer', 'admin');

-- CreateEnum
CREATE TYPE "admin_invitation_status" AS ENUM ('pending', 'accepted', 'expired', 'revoked');

-- CreateEnum
CREATE TYPE "verification_job_status" AS ENUM ('queued', 'processing', 'success', 'failed', 'dead_lettered');

-- CreateEnum
CREATE TYPE "verification_overall_result" AS ENUM ('passed', 'issues_found', 'low_confidence', 'failed');

-- CreateEnum
CREATE TYPE "verification_issue_type" AS ENUM ('missing_document', 'invalid_file', 'unreadable_document', 'field_mismatch', 'low_confidence', 'other');

-- CreateEnum
CREATE TYPE "verification_issue_severity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateTable
CREATE TABLE "admin_invitations" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "admin_invitation_role" NOT NULL,
    "invited_by_user_id" UUID NOT NULL,
    "accepted_by_user_id" UUID,
    "token_hash" TEXT NOT NULL,
    "status" "admin_invitation_status" NOT NULL DEFAULT 'pending',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_documents" (
    "id" UUID NOT NULL,
    "application_version_id" UUID NOT NULL,
    "document_type" "document_type" NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "storage_path" TEXT NOT NULL,
    "external_source_url" TEXT,
    "checksum" TEXT,
    "upload_status" "document_upload_status" NOT NULL DEFAULT 'uploaded',
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_versions" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "version_status" "application_version_status" NOT NULL DEFAULT 'draft',
    "form_snapshot" JSONB NOT NULL,
    "applicant_note" TEXT,
    "previous_version_id" UUID,
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL,
    "applicant_user_id" UUID NOT NULL,
    "application_no" TEXT NOT NULL,
    "status" "application_status" NOT NULL DEFAULT 'draft',
    "current_version_number" INTEGER NOT NULL DEFAULT 1,
    "current_application_version_id" UUID,
    "applicant_full_name" TEXT,
    "applicant_ic_no" TEXT,
    "business_name" TEXT,
    "business_registration_no" TEXT,
    "premise_address" TEXT,
    "premise_type" "premise_type",
    "floor_level" "floor_level",
    "entertainment_type" "entertainment_type",
    "submitted_at" TIMESTAMP(3),
    "decided_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "applicant_user_id" UUID NOT NULL,
    "decided_by_user_id" UUID,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preferred_start_at" TIMESTAMP(3) NOT NULL,
    "preferred_end_at" TIMESTAMP(3) NOT NULL,
    "scheduled_start_at" TIMESTAMP(3),
    "scheduled_end_at" TIMESTAMP(3),
    "status" "appointment_status" NOT NULL DEFAULT 'pending',
    "applicant_note" TEXT,
    "decision_reason" TEXT,
    "decided_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_user_id" UUID,
    "action" "audit_action" NOT NULL,
    "target_entity_type" TEXT NOT NULL,
    "target_entity_id" UUID,
    "application_id" UUID,
    "verification_job_id" UUID,
    "appointment_id" UUID,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_events" (
    "id" UUID NOT NULL,
    "event_type" "kpi_event_type" NOT NULL,
    "application_id" UUID,
    "verification_job_id" UUID,
    "appointment_id" UUID,
    "queue_wait_ms" INTEGER,
    "ai_processing_ms" INTEGER,
    "officer_processing_ms" INTEGER,
    "retry_count" INTEGER,
    "is_dead_letter" BOOLEAN NOT NULL DEFAULT false,
    "is_incomplete" BOOLEAN NOT NULL DEFAULT false,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kpi_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "officer_decisions" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "application_version_id" UUID NOT NULL,
    "officer_user_id" UUID NOT NULL,
    "decision_type" "officer_decision_type" NOT NULL,
    "reason_code" TEXT,
    "reason" TEXT,
    "officer_note" TEXT,
    "decided_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "officer_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "role" "role" NOT NULL,
    "account_status" "account_status" NOT NULL DEFAULT 'active',
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_issues" (
    "id" UUID NOT NULL,
    "verification_report_id" UUID NOT NULL,
    "application_document_id" UUID,
    "issue_type" "verification_issue_type" NOT NULL,
    "issue_severity" "verification_issue_severity" NOT NULL,
    "field_name" TEXT,
    "document_type" "document_type",
    "message" TEXT NOT NULL,
    "recommended_correction" TEXT,
    "rule_hit" TEXT,
    "model_rationale" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_jobs" (
    "id" UUID NOT NULL,
    "application_version_id" UUID NOT NULL,
    "bullmq_job_id" TEXT NOT NULL,
    "job_status" "verification_job_status" NOT NULL DEFAULT 'queued',
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "failure_reason" TEXT,
    "queued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_reports" (
    "id" UUID NOT NULL,
    "verification_job_id" UUID NOT NULL,
    "confidence_score" DOUBLE PRECISION,
    "overall_result" "verification_overall_result" NOT NULL,
    "manual_fallback_required" BOOLEAN NOT NULL DEFAULT false,
    "summary" TEXT,
    "model_version" TEXT,
    "prompt_policy_version" TEXT,
    "raw_result" JSONB NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_invitations_token_hash_key" ON "admin_invitations"("token_hash");

-- CreateIndex
CREATE INDEX "admin_invitations_invited_by_user_id_idx" ON "admin_invitations"("invited_by_user_id");

-- CreateIndex
CREATE INDEX "admin_invitations_accepted_by_user_id_idx" ON "admin_invitations"("accepted_by_user_id");

-- CreateIndex
CREATE INDEX "admin_invitations_status_idx" ON "admin_invitations"("status");

-- CreateIndex
CREATE INDEX "admin_invitations_expires_at_idx" ON "admin_invitations"("expires_at");

-- CreateIndex
CREATE INDEX "application_documents_application_version_id_idx" ON "application_documents"("application_version_id");

-- CreateIndex
CREATE INDEX "application_documents_document_type_idx" ON "application_documents"("document_type");

-- CreateIndex
CREATE INDEX "application_versions_application_id_idx" ON "application_versions"("application_id");

-- CreateIndex
CREATE INDEX "application_versions_previous_version_id_idx" ON "application_versions"("previous_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "application_versions_application_id_version_number_key" ON "application_versions"("application_id", "version_number");

-- CreateIndex
CREATE UNIQUE INDEX "applications_application_no_key" ON "applications"("application_no");

-- CreateIndex
CREATE UNIQUE INDEX "applications_current_application_version_id_key" ON "applications"("current_application_version_id");

-- CreateIndex
CREATE INDEX "applications_applicant_user_id_idx" ON "applications"("applicant_user_id");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE INDEX "applications_current_application_version_id_idx" ON "applications"("current_application_version_id");

-- CreateIndex
CREATE INDEX "appointments_application_id_idx" ON "appointments"("application_id");

-- CreateIndex
CREATE INDEX "appointments_applicant_user_id_idx" ON "appointments"("applicant_user_id");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE INDEX "audit_logs_actor_user_id_idx" ON "audit_logs"("actor_user_id");

-- CreateIndex
CREATE INDEX "audit_logs_application_id_idx" ON "audit_logs"("application_id");

-- CreateIndex
CREATE INDEX "audit_logs_verification_job_id_idx" ON "audit_logs"("verification_job_id");

-- CreateIndex
CREATE INDEX "audit_logs_appointment_id_idx" ON "audit_logs"("appointment_id");

-- CreateIndex
CREATE INDEX "audit_logs_target_entity_type_target_entity_id_idx" ON "audit_logs"("target_entity_type", "target_entity_id");

-- CreateIndex
CREATE INDEX "kpi_events_event_type_idx" ON "kpi_events"("event_type");

-- CreateIndex
CREATE INDEX "kpi_events_application_id_idx" ON "kpi_events"("application_id");

-- CreateIndex
CREATE INDEX "kpi_events_verification_job_id_idx" ON "kpi_events"("verification_job_id");

-- CreateIndex
CREATE INDEX "kpi_events_appointment_id_idx" ON "kpi_events"("appointment_id");

-- CreateIndex
CREATE INDEX "kpi_events_occurred_at_idx" ON "kpi_events"("occurred_at");

-- CreateIndex
CREATE INDEX "officer_decisions_application_id_idx" ON "officer_decisions"("application_id");

-- CreateIndex
CREATE INDEX "officer_decisions_application_version_id_idx" ON "officer_decisions"("application_version_id");

-- CreateIndex
CREATE INDEX "officer_decisions_officer_user_id_idx" ON "officer_decisions"("officer_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_account_status_idx" ON "users"("account_status");

-- CreateIndex
CREATE INDEX "verification_issues_verification_report_id_idx" ON "verification_issues"("verification_report_id");

-- CreateIndex
CREATE INDEX "verification_issues_application_document_id_idx" ON "verification_issues"("application_document_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_jobs_bullmq_job_id_key" ON "verification_jobs"("bullmq_job_id");

-- CreateIndex
CREATE INDEX "verification_jobs_application_version_id_idx" ON "verification_jobs"("application_version_id");

-- CreateIndex
CREATE INDEX "verification_jobs_job_status_idx" ON "verification_jobs"("job_status");

-- CreateIndex
CREATE UNIQUE INDEX "verification_reports_verification_job_id_key" ON "verification_reports"("verification_job_id");

-- AddForeignKey
ALTER TABLE "admin_invitations" ADD CONSTRAINT "admin_invitations_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_invitations" ADD CONSTRAINT "admin_invitations_accepted_by_user_id_fkey" FOREIGN KEY ("accepted_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_application_version_id_fkey" FOREIGN KEY ("application_version_id") REFERENCES "application_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_versions" ADD CONSTRAINT "application_versions_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_versions" ADD CONSTRAINT "application_versions_previous_version_id_fkey" FOREIGN KEY ("previous_version_id") REFERENCES "application_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicant_user_id_fkey" FOREIGN KEY ("applicant_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_current_application_version_id_fkey" FOREIGN KEY ("current_application_version_id") REFERENCES "application_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_applicant_user_id_fkey" FOREIGN KEY ("applicant_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_decided_by_user_id_fkey" FOREIGN KEY ("decided_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_verification_job_id_fkey" FOREIGN KEY ("verification_job_id") REFERENCES "verification_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_events" ADD CONSTRAINT "kpi_events_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_events" ADD CONSTRAINT "kpi_events_verification_job_id_fkey" FOREIGN KEY ("verification_job_id") REFERENCES "verification_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_events" ADD CONSTRAINT "kpi_events_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "officer_decisions" ADD CONSTRAINT "officer_decisions_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "officer_decisions" ADD CONSTRAINT "officer_decisions_application_version_id_fkey" FOREIGN KEY ("application_version_id") REFERENCES "application_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "officer_decisions" ADD CONSTRAINT "officer_decisions_officer_user_id_fkey" FOREIGN KEY ("officer_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_issues" ADD CONSTRAINT "verification_issues_verification_report_id_fkey" FOREIGN KEY ("verification_report_id") REFERENCES "verification_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_issues" ADD CONSTRAINT "verification_issues_application_document_id_fkey" FOREIGN KEY ("application_document_id") REFERENCES "application_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_jobs" ADD CONSTRAINT "verification_jobs_application_version_id_fkey" FOREIGN KEY ("application_version_id") REFERENCES "application_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_reports" ADD CONSTRAINT "verification_reports_verification_job_id_fkey" FOREIGN KEY ("verification_job_id") REFERENCES "verification_jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
