# Refined System Requirements (v3)

## Changelog from v2

- Added standalone appointment subsystem `S5: Appointment Scheduling and Visit Coordination`
- Added appointment interface type definitions: `AppointmentRequest` and `AppointmentDecision`
- Added `INT-14` through `INT-18` for appointment eligibility, status publication, auth validation, and optional KPI events
- Updated auth coverage to include S5 in centralized validation flows
- Updated team ownership and objective traceability to include appointment workflow responsibilities

---

## Source Alignment

The current district office process requires in-person visits for information lookup, document submission, and status checking. Manual document completeness checks create counter congestion, repeated applicant visits, and long processing time. Unscheduled physical visits also create avoidable counter traffic because approved applicants do not have a structured appointment channel for follow-up submission or visit coordination.

Project objectives used for alignment:

- O1: Build an online entertainment license application platform with AI-based automatic verification before officer processing.
- O2: Reduce incomplete applications by at least 60% through automated preliminary screening.
- O3: Reduce application processing time through a digital workflow within six months after implementation.

---

## Requirement Format

Each requirement uses the following format:

- ID: `Sx-FR-##` (functional), `Sx-NFR-##` (non-functional), `INT-##` (interface/handoff)
- Type: `FR`, `NFR`, or `INT`
- Module: subsystem module where the requirement belongs
- Requirement Statement: clear, testable system behavior
- Objective Link: `O1`, `O2`, `O3` (one or more)

---

## Subsystems and Modules

### S1: Identity, Access, and Security

#### Module S1-M1: Registration and Authentication

- `S1-FR-01` | Type: `FR` | Module: `S1-M1`
  Requirement: The system shall allow general applicants to register using email and password.
  Objective Link: `O1`
- `S1-FR-02` | Type: `FR` | Module: `S1-M1`
  Requirement: The system shall allow login for applicant and admin/officer accounts with authenticated sessions.
  Objective Link: `O1`, `O3`
- `S1-FR-03` | Type: `FR` | Module: `S1-M1`
  Requirement: The system shall support password reset through verified email.
  Objective Link: `O1`
- `S1-NFR-01` | Type: `NFR` | Module: `S1-M1`
  Requirement: Authentication failures and lockout events shall be logged with timestamp and account ID.
  Objective Link: `O3`

#### Module S1-M2: Admin Invitation and Role-Based Access Control

- `S1-FR-04` | Type: `FR` | Module: `S1-M2`
  Requirement: The system shall allow admin registration only for pre-invited email addresses.
  Objective Link: `O1`
- `S1-FR-05` | Type: `FR` | Module: `S1-M2`
  Requirement: The system shall enforce role-based access control for applicant, admin/officer, and analytics views.
  Objective Link: `O1`, `O3`
- `S1-NFR-02` | Type: `NFR` | Module: `S1-M2`
  Requirement: Authorization checks shall be applied server-side for every protected endpoint and action.
  Objective Link: `O3`

#### Module S1-M3: Security, Privacy, and Audit

- `S1-FR-06` | Type: `FR` | Module: `S1-M3`
  Requirement: The system shall maintain an immutable audit trail for security-relevant user actions (login, submission, status update, decision update, appointment action).
  Objective Link: `O3`
- `S1-FR-07` | Type: `FR` | Module: `S1-M3`
  Requirement: The system shall provide centralized auth validation for internal subsystem requests from S2, S3, S4, and S5 before protected operations proceed.
  Objective Link: `O1`, `O3`
- `S1-FR-08` | Type: `FR` | Module: `S1-M3`
  Requirement: The system shall return standardized auth decision payloads to consuming subsystems with allow/deny result, role claims, and audit correlation metadata.
  Objective Link: `O1`, `O3`
- `S1-NFR-03` | Type: `NFR` | Module: `S1-M3`
  Requirement: The system shall encrypt data in transit (TLS) and sensitive stored data at rest.
  Objective Link: `O3`
- `S1-NFR-04` | Type: `NFR` | Module: `S1-M3`
  Requirement: User sessions shall expire after a configurable inactivity timeout and support secure logout.
  Objective Link: `O3`
- `S1-NFR-05` | Type: `NFR` | Module: `S1-M3`
  Requirement: The system shall apply least-privilege access and prohibit cross-role data exposure.
  Objective Link: `O3`

---

### S2: Applicant Portal and Guidance

#### Module S2-M1: Application Intake, Pre-Validation, and Document Storage

- `S2-FR-01` | Type: `FR` | Module: `S2-M1`
  Requirement: The system shall provide an online application form for entertainment license requests.
  Objective Link: `O1`
- `S2-FR-02` | Type: `FR` | Module: `S2-M1`
  Requirement: The system shall allow applicants to upload required supporting documents via Supabase Storage into scoped paths (`applications/{applicant_id}/{submission_id}/`).
  Objective Link: `O1`
- `S2-FR-02a` | Type: `FR` | Module: `S2-M1`
  Requirement: Uploaded documents shall be stored in private Supabase Storage buckets, accessible only by the owning applicant and authorized officers via row-level security policies.
  Objective Link: `O1`, `O3`
- `S2-FR-02b` | Type: `FR` | Module: `S2-M1`
  Requirement: The system shall generate short-lived signed URLs for uploaded documents when constructing verification job payloads, with expiry configured to exceed the maximum expected job processing window.
  Objective Link: `O1`, `O3`
- `S2-FR-03` | Type: `FR` | Module: `S2-M1`
  Requirement: The system shall validate required fields, file type, file size, and mandatory document presence before enqueuing the application for AI verification.
  Objective Link: `O1`, `O2`
- `S2-FR-04` | Type: `FR` | Module: `S2-M1`
  Requirement: The system shall block submission when mandatory validation errors are unresolved and present actionable error messages.
  Objective Link: `O2`, `O3`
- `S2-FR-04a` | Type: `FR` | Module: `S2-M1`
  Requirement: Upon successful pre-validation, the system shall persist the application to the database, enqueue a `VerificationJobPayload` onto the BullMQ queue, and immediately return a submitted status to the applicant without waiting for AI verification to complete.
  Objective Link: `O1`, `O3`
- `S2-FR-04b` | Type: `FR` | Module: `S2-M1`
  Requirement: The system shall not enqueue a duplicate verification job for a submission version that is already queued or actively processing (idempotency guard).
  Objective Link: `O3`
- `S2-NFR-01` | Type: `NFR` | Module: `S2-M1`
  Requirement: Form save and submit actions shall complete within acceptable response time under normal load. The submission response shall not be blocked by AI verification processing time.
  Objective Link: `O3`

#### Module S2-M2: Applicant Guidance and Checklist

- `S2-FR-05` | Type: `FR` | Module: `S2-M2`
  Requirement: The system shall provide an AI chatbot to answer applicant questions about form fields and required documents.
  Objective Link: `O1`, `O2`
- `S2-FR-06` | Type: `FR` | Module: `S2-M2`
  Requirement: The system shall provide a dynamic checklist showing completed and missing requirements before submission.
  Objective Link: `O2`
- `S2-FR-07` | Type: `FR` | Module: `S2-M2`
  Requirement: The system shall present verification feedback in plain language with a direct link to the affected form/document section.
  Objective Link: `O2`, `O3`
- `S2-NFR-02` | Type: `NFR` | Module: `S2-M2`
  Requirement: Applicant guidance content shall be available in clear, non-technical language suitable for first-time applicants.
  Objective Link: `O2`

#### Module S2-M3: Application Lifecycle, Status, and Notification

- `S2-FR-08` | Type: `FR` | Module: `S2-M3`
  Requirement: The system shall allow applicants to save drafts and continue later without data loss.
  Objective Link: `O1`, `O3`
- `S2-FR-09` | Type: `FR` | Module: `S2-M3`
  Requirement: The system shall support resubmission after correction requests and retain version history for each resubmission.
  Objective Link: `O2`, `O3`
- `S2-FR-10` | Type: `FR` | Module: `S2-M3`
  Requirement: The system shall display real-time application status states (draft, submitted, verification queued, verification in progress, verification complete, pending officer review, correction required, approved, rejected) pushed via Supabase Realtime without requiring page refresh.
  Objective Link: `O1`, `O3`
- `S2-FR-11` | Type: `FR` | Module: `S2-M3`
  Requirement: The system shall send email notifications on key application status changes, including approval and rejection.
  Objective Link: `O3`
- `S2-FR-12` | Type: `FR` | Module: `S2-M3`
  Requirement: The system shall require successful auth validation from S1 before protected applicant operations (save draft, submit, resubmit, and view status).
  Objective Link: `O1`, `O3`
- `S2-NFR-03` | Type: `NFR` | Module: `S2-M3`
  Requirement: Application status updates and application notification events shall be idempotent to avoid duplicate state transitions and duplicate emails.
  Objective Link: `O3`

---

### S3: AI Verification and Pre-Screening

#### Module S3-M1: Automated Verification Engine

- `S3-FR-01` | Type: `FR` | Module: `S3-M1`
  Requirement: The system shall run automated pre-screen verification on submitted form data and uploaded documents by consuming jobs from the BullMQ verification queue before officer review.
  Objective Link: `O1`
- `S3-FR-02` | Type: `FR` | Module: `S3-M1`
  Requirement: The verification engine shall detect missing documents, invalid document attributes, and inconsistent application details.
  Objective Link: `O1`, `O2`
- `S3-FR-03` | Type: `FR` | Module: `S3-M1`
  Requirement: The system shall support re-verification of corrected submissions and compare results against the previous submission version.
  Objective Link: `O2`, `O3`
- `S3-NFR-01` | Type: `NFR` | Module: `S3-M1`
  Requirement: AI verification results shall be returned within a target processing window suitable for same-day applicant correction cycles. Queue wait time and active processing time shall be tracked as separate metrics.
  Objective Link: `O3`

#### Module S3-M2: Verification Report and Explainability

- `S3-FR-04` | Type: `FR` | Module: `S3-M2`
  Requirement: The system shall generate a structured verification report listing detected issues by field/document, severity, and recommended correction.
  Objective Link: `O1`, `O2`
- `S3-FR-05` | Type: `FR` | Module: `S3-M2`
  Requirement: Each detected issue shall include explainability metadata (rule hit and/or model rationale snippet) visible to officers and applicants where appropriate.
  Objective Link: `O1`, `O2`
- `S3-NFR-02` | Type: `NFR` | Module: `S3-M2`
  Requirement: Verification report formats shall be consistent and machine-readable for downstream workflow and analytics consumption.
  Objective Link: `O3`

#### Module S3-M3: Confidence Threshold and Manual Fallback

- `S3-FR-06` | Type: `FR` | Module: `S3-M3`
  Requirement: The system shall assign a confidence score to each verification result and flag low-confidence cases for manual officer attention.
  Objective Link: `O1`, `O3`
- `S3-FR-07` | Type: `FR` | Module: `S3-M3`
  Requirement: When AI service is unavailable or a verification job exceeds the maximum retry count, the job shall be moved to a dead-letter queue, the application status updated to require manual pre-screening, and an audit event recorded with the failure reason without blocking or losing application context.
  Objective Link: `O3`
- `S3-FR-08` | Type: `FR` | Module: `S3-M3`
  Requirement: The system shall require successful auth validation from S1 before executing or continuing verification actions in user-triggered or service-triggered contexts.
  Objective Link: `O1`, `O3`
- `S3-NFR-03` | Type: `NFR` | Module: `S3-M3`
  Requirement: AI model version and prompt/policy version used for each verification shall be recorded for auditability.
  Objective Link: `O3`
- `S3-NFR-04` | Type: `NFR` | Module: `S3-M3`
  Requirement: Manual fallback routing shall maintain service continuity and not lose application context.
  Objective Link: `O3`

#### Module S3-M4: Queue Infrastructure and Worker Management

- `S3-FR-09` | Type: `FR` | Module: `S3-M4`
  Requirement: The system shall provide a BullMQ worker process that consumes `VerificationJobPayload` messages from the Redis-backed verification queue and invokes the FastAPI verification engine.
  Objective Link: `O1`, `O3`
- `S3-FR-10` | Type: `FR` | Module: `S3-M4`
  Requirement: The worker shall apply a configurable retry policy (maximum retry count, backoff strategy) before routing a failed job to the dead-letter queue.
  Objective Link: `O3`
- `S3-FR-11` | Type: `FR` | Module: `S3-M4`
  Requirement: The worker shall emit a job completion event (success or dead-lettered) that triggers a status update in S2 and a KPI event in S4.
  Objective Link: `O1`, `O2`, `O3`
- `S3-FR-12` | Type: `FR` | Module: `S3-M4`
  Requirement: The system shall enforce that only one active job exists per submission version at any time; duplicate enqueue attempts shall be rejected with a conflict response.
  Objective Link: `O3`
- `S3-NFR-05` | Type: `NFR` | Module: `S3-M4`
  Requirement: Redis and BullMQ configuration (queue names, retry limits, signed URL expiry window) shall be externalized as environment variables and not hardcoded.
  Objective Link: `O3`
- `S3-NFR-06` | Type: `NFR` | Module: `S3-M4`
  Requirement: The BullMQ dashboard (or equivalent monitoring interface) shall be available to authorized admins to inspect queue depth, active jobs, and dead-letter items.
  Objective Link: `O3`

---

### S4: Officer Workflow, Decisioning, and Analytics

#### Module S4-M1: Officer Review and Decision Workflow

- `S4-FR-01` | Type: `FR` | Module: `S4-M1`
  Requirement: The system shall provide an officer queue for applications that passed or completed pre-screening.
  Objective Link: `O1`, `O3`
- `S4-FR-02` | Type: `FR` | Module: `S4-M1`
  Requirement: Officers shall be able to approve, reject, or request correction with mandatory reason codes/notes.
  Objective Link: `O2`, `O3`
- `S4-FR-03` | Type: `FR` | Module: `S4-M1`
  Requirement: The system shall generate a final application outcome report after case closure.
  Objective Link: `O3`
- `S4-FR-11` | Type: `FR` | Module: `S4-M1`
  Requirement: The system shall require successful auth validation from S1 before protected officer/admin actions (review queue access, approve/reject/request-correction, report generation, dashboard access).
  Objective Link: `O3`
- `S4-NFR-01` | Type: `NFR` | Module: `S4-M1`
  Requirement: Officer actions shall be transaction-safe and prevent partial decision updates.
  Objective Link: `O3`

#### Module S4-M2: Decision Logging and Operational Audit

- `S4-FR-04` | Type: `FR` | Module: `S4-M2`
  Requirement: The system shall record a decision audit trail including officer ID, decision type, reason, and timestamp for every application status change.
  Objective Link: `O3`
- `S4-FR-05` | Type: `FR` | Module: `S4-M2`
  Requirement: Authorized users shall be able to retrieve decision history and verification history for case review and dispute handling.
  Objective Link: `O3`
- `S4-NFR-02` | Type: `NFR` | Module: `S4-M2`
  Requirement: Audit and decision logs shall be tamper-evident and retained according to policy-defined periods.
  Objective Link: `O3`

#### Module S4-M3: Dashboard, KPI Baseline, and 6-Month Tracking

- `S4-FR-06` | Type: `FR` | Module: `S4-M3`
  Requirement: The analytics dashboard shall show total applications, approved, in process, rejected, and correction-required counts.
  Objective Link: `O3`
- `S4-FR-07` | Type: `FR` | Module: `S4-M3`
  Requirement: The system shall establish baseline metrics for incomplete application rate and processing cycle time before or at go-live.
  Objective Link: `O2`, `O3`
- `S4-FR-08` | Type: `FR` | Module: `S4-M3`
  Requirement: The system shall track monthly KPI trends for at least six months after implementation for incomplete rate and end-to-end processing time.
  Objective Link: `O2`, `O3`
- `S4-FR-09` | Type: `FR` | Module: `S4-M3`
  Requirement: The system shall compute and display progress against targets, including >=60% reduction in incomplete applications.
  Objective Link: `O2`
- `S4-FR-10` | Type: `FR` | Module: `S4-M3`
  Requirement: The system shall allow export of KPI and operational reports for management review.
  Objective Link: `O3`
- `S4-FR-12` | Type: `FR` | Module: `S4-M3`
  Requirement: The analytics dashboard shall include queue performance metrics: average queue wait time, average AI processing time, retry rate, and dead-letter rate tracked separately from officer processing time.
  Objective Link: `O3`
- `S4-NFR-03` | Type: `NFR` | Module: `S4-M3`
  Requirement: KPI calculations shall use consistent definitions and timestamp sources across all workflow stages, including queue enqueue time, dequeue time, and verification completion time.
  Objective Link: `O2`, `O3`

---

### S5: Appointment Scheduling and Visit Coordination

#### Module S5-M1: Applicant Appointment Request

- `S5-FR-01` | Type: `FR` | Module: `S5-M1`
  Requirement: The system shall expose appointment eligibility only for applications that have reached the approved status in S4.
  Objective Link: `O3`
- `S5-FR-02` | Type: `FR` | Module: `S5-M1`
  Requirement: The system shall allow an eligible applicant to request a preferred appointment date and time for physical visit coordination after application approval.
  Objective Link: `O3`
- `S5-FR-03` | Type: `FR` | Module: `S5-M1`
  Requirement: The system shall allow applicants to view the current appointment request status (pending, approved, rejected, unavailable) for each approved application.
  Objective Link: `O3`
- `S5-FR-04` | Type: `FR` | Module: `S5-M1`
  Requirement: The system shall publish appointment status updates to the applicant-facing portal without changing the application status model owned by S2 and S4.
  Objective Link: `O3`

#### Module S5-M2: Admin Appointment Review and Scheduling

- `S5-FR-05` | Type: `FR` | Module: `S5-M2`
  Requirement: The system shall allow authorized admins/officers to review pending appointment requests for approved applications.
  Objective Link: `O3`
- `S5-FR-06` | Type: `FR` | Module: `S5-M2`
  Requirement: Authorized admins/officers shall be able to approve or reject appointment requests based on schedule availability.
  Objective Link: `O3`
- `S5-FR-07` | Type: `FR` | Module: `S5-M2`
  Requirement: Every appointment decision shall record the appointment status, reason, admin/officer ID, and decision timestamp.
  Objective Link: `O3`
- `S5-FR-08` | Type: `FR` | Module: `S5-M2`
  Requirement: If a pending appointment request has no admin/officer action by one day before the requested appointment time, the system shall mark the request as unavailable and notify the applicant that no admin is available.
  Objective Link: `O3`

#### Module S5-M3: Appointment Notification and Audit

- `S5-FR-09` | Type: `FR` | Module: `S5-M3`
  Requirement: The system shall send email notifications for appointment request received, approved, rejected, and unavailable outcomes.
  Objective Link: `O3`
- `S5-FR-10` | Type: `FR` | Module: `S5-M3`
  Requirement: The system shall require successful auth validation from S1 before protected appointment actions, including viewing eligibility, requesting appointments, reviewing requests, and approving/rejecting appointments.
  Objective Link: `O1`, `O3`
- `S5-FR-11` | Type: `FR` | Module: `S5-M3`
  Requirement: The system shall maintain an appointment audit trail for request creation, decision updates, status transitions, and notification dispatch events.
  Objective Link: `O3`
- `S5-NFR-01` | Type: `NFR` | Module: `S5-M3`
  Requirement: Appointment status updates and appointment notification events shall be idempotent to avoid duplicate status transitions and duplicate emails.
  Objective Link: `O3`
- `S5-NFR-02` | Type: `NFR` | Module: `S5-M3`
  Requirement: Appointment scheduling scope shall be limited to physical visit coordination and shall not require full calendar resource management.
  Objective Link: `O3`

---

## Cross-Subsystem Interface and Handoff Contracts

### Interface Type Definitions

- `AuthValidationRequest`
  Fields: actor type, credential/token context, requested action, target resource/application ID, correlation ID.

- `AuthValidationResult`
  Fields: decision (allow/deny), subject ID, role claims, permitted scope, expiry, denial reason, audit reference ID.

- `VerificationJobPayload`
  Fields: application ID, submission version, applicant ID, form data snapshot, document metadata list, signed URL per document (short-lived), correlation ID, enqueue timestamp.

- `VerificationJobResult`
  Fields: application ID, submission version, job status (success | dead-lettered), verification report reference, confidence score, fallback flag, completion timestamp, correlation ID.

- `AppointmentRequest`
  Fields: applicant ID, application ID, requested date, requested time, request status, created timestamp, correlation ID.

- `AppointmentDecision`
  Fields: application ID, appointment request ID, decision (approved | rejected | unavailable), admin ID, reason, decided timestamp, correlation ID.

### Interface Contracts

- `INT-01` | Type: `INT` | Module: `Queue S2 -> S3`
  Requirement: Upon successful submission, S2 shall push a `VerificationJobPayload` onto the BullMQ verification queue. S3 worker consumes this payload asynchronously; no direct HTTP call is made from S2 to S3.
  Objective Link: `O1`, `O2`

- `INT-02` | Type: `INT` | Module: `Handoff S3 -> S2`
  Requirement: The system shall return a `VerificationResult` (issue list, severity, explainability, correction guidance, confidence score) to the applicant portal by writing results to the database and triggering a Supabase Realtime status update to S2.
  Objective Link: `O1`, `O2`

- `INT-03` | Type: `INT` | Module: `Handoff S3 -> S4`
  Requirement: The system shall provide verification outcome and fallback flags to officer workflow for manual follow-up decisions.
  Objective Link: `O1`, `O3`

- `INT-04` | Type: `INT` | Module: `Handoff S4 -> S2`
  Requirement: The system shall publish a `DecisionRecord` (status, reason code, officer note, timestamp) to applicant status and notification modules.
  Objective Link: `O3`

- `INT-05` | Type: `INT` | Module: `Event S2/S3/S4 -> S4-M3`
  Requirement: Subsystems S2, S3, and S4 shall emit normalized KPI events for baseline setup and six-month performance tracking. S3 worker shall additionally emit queue enqueue time, dequeue time, retry count, and job completion timestamp per verification job.
  Objective Link: `O2`, `O3`

- `INT-06` | Type: `INT` | Module: `Handoff S2 -> S1`
  Requirement: S2 shall send an `AuthValidationRequest` to S1 before protected applicant operations (save draft, submit, resubmit, view status).
  Objective Link: `O1`, `O3`

- `INT-07` | Type: `INT` | Module: `Handoff S1 -> S2`
  Requirement: S1 shall return an `AuthValidationResult` to S2 with allow/deny decision, subject identity, role claims, expiry, denial reason, and audit reference.
  Objective Link: `O1`, `O3`

- `INT-08` | Type: `INT` | Module: `Handoff S3 -> S1`
  Requirement: S3 shall send an `AuthValidationRequest` to S1 for verification execution context validation in user-triggered and service-triggered flows.
  Objective Link: `O1`, `O3`

- `INT-09` | Type: `INT` | Module: `Handoff S1 -> S3`
  Requirement: S1 shall return an `AuthValidationResult` to S3 with decision outcome and audit correlation metadata for verification workflow logging.
  Objective Link: `O1`, `O3`

- `INT-10` | Type: `INT` | Module: `Handoff S4 -> S1`
  Requirement: S4 shall send an `AuthValidationRequest` to S1 before protected officer/admin actions.
  Objective Link: `O3`

- `INT-11` | Type: `INT` | Module: `Handoff S1 -> S4`
  Requirement: S1 shall return an `AuthValidationResult` to S4 with allow/deny decision, subject identity, role claims, expiry, denial reason, and audit reference.
  Objective Link: `O3`

- `INT-12` | Type: `INT` | Module: `Queue event S3 -> S2`
  Requirement: Upon job completion (success or dead-lettered), the S3 worker shall write the `VerificationJobResult` to the database; S2 shall subscribe via Supabase Realtime to propagate the status change to the applicant frontend.
  Objective Link: `O1`, `O3`

- `INT-13` | Type: `INT` | Module: `Queue event S3 -> S4`
  Requirement: The S3 worker shall emit a normalized KPI event to S4-M3 upon job completion, including queue wait duration, processing duration, retry count, and outcome (success or dead-lettered).
  Objective Link: `O2`, `O3`

- `INT-14` | Type: `INT` | Module: `Handoff S4 -> S5`
  Requirement: When an application reaches approved status, S4 shall publish appointment eligibility to S5 so that appointment requests can be opened only after officer approval.
  Objective Link: `O3`

- `INT-15` | Type: `INT` | Module: `Handoff S5 -> S2`
  Requirement: S5 shall publish appointment request status updates to the applicant-facing portal in S2 without altering the application status definitions managed by S2 and S4.
  Objective Link: `O3`

- `INT-16` | Type: `INT` | Module: `Handoff S5 -> S1`
  Requirement: S5 shall send an `AuthValidationRequest` to S1 before protected appointment actions for applicant and admin/officer users.
  Objective Link: `O1`, `O3`

- `INT-17` | Type: `INT` | Module: `Handoff S1 -> S5`
  Requirement: S1 shall return an `AuthValidationResult` to S5 with allow/deny decision, subject identity, role claims, expiry, denial reason, and audit reference.
  Objective Link: `O1`, `O3`

- `INT-18` | Type: `INT` | Module: `Event S5 -> S4-M3`
  Requirement: If appointment operations are included in analytics, S5 shall emit lightweight operational events for appointment request creation, decision time, and unavailable outcomes for reporting in S4-M3.
  Objective Link: `O3`

---

## Team Ownership

- **Member 1**
  Primary Subsystem: `S1: Identity, Access, and Security`
  Core Modules: `S1-M1`, `S1-M2`, `S1-M3`
  Dependencies/Handoffs: Provides centralized auth validation interfaces for S2, S3, S4, and S5 (`INT-06` through `INT-11`, `INT-16`, `INT-17`); provides RBAC and audit foundation to all subsystems.

- **Member 2**
  Primary Subsystem: `S2: Applicant Portal and Guidance`
  Core Modules: `S2-M1`, `S2-M2`, `S2-M3`
  Queue Responsibilities: Enqueues `VerificationJobPayload` after submission (`INT-01`); generates short-lived signed URLs for documents (`S2-FR-02b`); implements idempotency guard (`S2-FR-04b`); subscribes to Supabase Realtime for job completion events (`INT-12`).
  Dependencies/Handoffs: Requests and consumes auth from S1 (`INT-06`, `INT-07`); pushes to queue (`INT-01`); consumes verification and decision outputs from S3/S4 (`INT-02`, `INT-04`, `INT-12`); displays appointment status updates from S5 (`INT-15`).

- **Member 3**
  Primary Subsystem: `S3: AI Verification and Pre-Screening`
  Core Modules: `S3-M1`, `S3-M2`, `S3-M3`, `S3-M4`
  Queue Responsibilities: Owns Redis + BullMQ infrastructure setup and configuration (`S3-M4`); implements the worker process that consumes jobs and calls FastAPI (`S3-FR-09`); implements retry policy and dead-letter routing (`S3-FR-10`); emits job completion events to S2 and S4 (`S3-FR-11`, `INT-12`, `INT-13`).
  Dependencies/Handoffs: Requests and consumes auth from S1 (`INT-08`, `INT-09`); consumes job payload from S2 via queue (`INT-01`); writes verification results to database; emits completion events to S2 and S4 (`INT-02`, `INT-03`, `INT-12`, `INT-13`).

- **Member 4**
  Primary Subsystems: `S4: Officer Workflow, Decisioning, and Analytics`; `S5: Appointment Scheduling and Visit Coordination`
  Core Modules: `S4-M1`, `S4-M2`, `S4-M3`, `S5-M1`, `S5-M2`, `S5-M3`
  Queue Responsibilities: Consumes queue KPI events from S3 (`INT-13`); tracks queue metrics (wait time, processing time, retry rate, dead-letter rate) in the analytics dashboard (`S4-FR-12`).
  Appointment Responsibilities: Owns appointment eligibility intake from S4 (`INT-14`); owns appointment request review and status decisions in S5; optionally aggregates appointment operational events in analytics (`INT-18`).
  Dependencies/Handoffs: Requests and consumes auth from S1 (`INT-10`, `INT-11`, `INT-16`, `INT-17`); consumes verification output from S3; sends decision records to S2; publishes appointment eligibility to S5; aggregates KPI events from S2/S3/S4 and optional appointment events from S5 (`INT-04`, `INT-05`, `INT-13`, `INT-14`, `INT-18`).

---

## Objective Traceability Matrix

- **O1: Online platform with AI pre-verification**
  Measurable Target: AI pre-screen runs before officer review for all submitted applications, delivered asynchronously via queue.
  Primary Requirement Coverage: `S1-FR-07`, `S2-FR-01`, `S2-FR-03`, `S2-FR-04a`, `S2-FR-12`, `S3-FR-01`, `S3-FR-04`, `S3-FR-08`, `S3-FR-09`, `S4-FR-01`, `S5-FR-10`, `INT-01`, `INT-03`, `INT-06`, `INT-07`, `INT-08`, `INT-09`, `INT-12`, `INT-16`, `INT-17`

- **O2: Reduce incomplete applications by >=60%**
  Measurable Target: Incomplete-rate reduction against baseline reaches >=60% within monitored period.
  Primary Requirement Coverage: `S2-FR-03`, `S2-FR-04`, `S2-FR-06`, `S2-FR-09`, `S3-FR-02`, `S3-FR-04`, `S3-FR-11`, `S4-FR-07`, `S4-FR-08`, `S4-FR-09`, `INT-05`, `INT-13`

- **O3: Reduce processing time within 6 months**
  Measurable Target: Cycle-time trend (including queue wait time and appointment coordination after approval) decreases from baseline within 6 months after implementation.
  Primary Requirement Coverage: `S1-FR-06`, `S1-FR-07`, `S1-FR-08`, `S2-FR-04a`, `S2-FR-10`, `S2-FR-12`, `S3-FR-06`, `S3-FR-07`, `S3-FR-08`, `S3-FR-09`, `S3-FR-10`, `S3-FR-11`, `S3-FR-12`, `S3-NFR-01`, `S3-NFR-05`, `S4-FR-01`, `S4-FR-02`, `S4-FR-08`, `S4-FR-11`, `S4-FR-12`, `S4-NFR-03`, `S5-FR-01`, `S5-FR-02`, `S5-FR-03`, `S5-FR-04`, `S5-FR-05`, `S5-FR-06`, `S5-FR-07`, `S5-FR-08`, `S5-FR-09`, `S5-FR-10`, `S5-FR-11`, `S5-NFR-01`, `S5-NFR-02`, `INT-04`, `INT-05`, `INT-06`, `INT-07`, `INT-08`, `INT-09`, `INT-10`, `INT-11`, `INT-12`, `INT-13`, `INT-14`, `INT-15`, `INT-16`, `INT-17`, `INT-18`
