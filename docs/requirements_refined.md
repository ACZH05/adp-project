# Refined System Requirements

## Source Alignment
The current district office process requires in-person visits for information lookup, document submission, and status checking. Manual document completeness checks create counter congestion, repeated applicant visits, and long processing time.

Project objectives used for alignment:
- O1: Build an online entertainment license application platform with AI-based automatic verification before officer processing.
- O2: Reduce incomplete applications by at least 60% through automated preliminary screening.
- O3: Reduce application processing time through a digital workflow within six months after implementation.

## Requirement Format
Each requirement uses the following format:
- ID: `Sx-FR-##` (functional), `Sx-NFR-##` (non-functional), `INT-##` (interface/handoff)
- Type: `FR`, `NFR`, or `INT`
- Module: subsystem module where the requirement belongs
- Requirement Statement: clear, testable system behavior
- Objective Link: `O1`, `O2`, `O3` (one or more)

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
  Requirement: The system shall maintain an immutable audit trail for security-relevant user actions (login, submission, status update, decision update).
  Objective Link: `O3`
- `S1-FR-07` | Type: `FR` | Module: `S1-M3`
  Requirement: The system shall provide centralized auth validation for internal subsystem requests from S2, S3, and S4 before protected operations proceed.
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

### S2: Applicant Portal and Guidance

#### Module S2-M1: Application Intake and Pre-Validation
- `S2-FR-01` | Type: `FR` | Module: `S2-M1`
  Requirement: The system shall provide an online application form for entertainment license requests.
  Objective Link: `O1`
- `S2-FR-02` | Type: `FR` | Module: `S2-M1`
  Requirement: The system shall allow applicants to upload required supporting documents.
  Objective Link: `O1`
- `S2-FR-03` | Type: `FR` | Module: `S2-M1`
  Requirement: The system shall validate required fields, file type, file size, and mandatory document presence before sending an application for AI verification.
  Objective Link: `O1`, `O2`
- `S2-FR-04` | Type: `FR` | Module: `S2-M1`
  Requirement: The system shall block submission when mandatory validation errors are unresolved and present actionable error messages.
  Objective Link: `O2`, `O3`
- `S2-NFR-01` | Type: `NFR` | Module: `S2-M1`
  Requirement: Form save and submit actions shall complete within acceptable response time under normal load.
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
  Requirement: The system shall display real-time application status states (draft, pending verification, pending officer review, correction required, approved, rejected).
  Objective Link: `O1`, `O3`
- `S2-FR-11` | Type: `FR` | Module: `S2-M3`
  Requirement: The system shall send email notifications on key status changes, including approval and rejection.
  Objective Link: `O3`
- `S2-FR-12` | Type: `FR` | Module: `S2-M3`
  Requirement: The system shall require successful auth validation from S1 before protected applicant operations (save draft, submit, resubmit, and view status).
  Objective Link: `O1`, `O3`
- `S2-NFR-03` | Type: `NFR` | Module: `S2-M3`
  Requirement: Status updates and notification events shall be idempotent to avoid duplicate state transitions and duplicate emails.
  Objective Link: `O3`

### S3: AI Verification and Pre-Screening

#### Module S3-M1: Automated Verification Engine
- `S3-FR-01` | Type: `FR` | Module: `S3-M1`
  Requirement: The system shall run automated pre-screen verification on submitted form data and uploaded documents before officer review.
  Objective Link: `O1`
- `S3-FR-02` | Type: `FR` | Module: `S3-M1`
  Requirement: The verification engine shall detect missing documents, invalid document attributes, and inconsistent application details.
  Objective Link: `O1`, `O2`
- `S3-FR-03` | Type: `FR` | Module: `S3-M1`
  Requirement: The system shall support re-verification of corrected submissions and compare results against the previous submission version.
  Objective Link: `O2`, `O3`
- `S3-NFR-01` | Type: `NFR` | Module: `S3-M1`
  Requirement: AI verification results shall be returned within a target processing window suitable for same-day applicant correction cycles.
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
  Requirement: When AI service is unavailable or confidence is below threshold, the system shall route the application to manual pre-screening without blocking the overall workflow.
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
- `S4-NFR-03` | Type: `NFR` | Module: `S4-M3`
  Requirement: KPI calculations shall use consistent definitions and timestamp sources across all workflow stages.
  Objective Link: `O2`, `O3`

### Cross-Subsystem Interface and Handoff Contracts
- Interface Type Definition: `AuthValidationRequest`
  Fields: actor type, credential/token context, requested action, target resource/application ID, correlation ID.
- Interface Type Definition: `AuthValidationResult`
  Fields: decision (allow/deny), subject ID, role claims, permitted scope, expiry, denial reason, audit reference ID.

- `INT-01` | Type: `INT` | Module: `Handoff S2 -> S3`
  Requirement: The system shall transmit an `ApplicationPackage` (form data, document metadata, checklist state, submission version) from intake to AI verification.
  Objective Link: `O1`, `O2`
- `INT-02` | Type: `INT` | Module: `Handoff S3 -> S2`
  Requirement: The system shall return a `VerificationResult` (issue list, severity, explainability, correction guidance, confidence score) to the applicant portal.
  Objective Link: `O1`, `O2`
- `INT-03` | Type: `INT` | Module: `Handoff S3 -> S4`
  Requirement: The system shall provide verification outcome and fallback flags to officer workflow for manual follow-up decisions.
  Objective Link: `O1`, `O3`
- `INT-04` | Type: `INT` | Module: `Handoff S4 -> S2`
  Requirement: The system shall publish a `DecisionRecord` (status, reason code, officer note, timestamp) to applicant status and notification modules.
  Objective Link: `O3`
- `INT-05` | Type: `INT` | Module: `Event S2/S3/S4 -> S4-M3`
  Requirement: Subsystems S2, S3, and S4 shall emit normalized KPI events for baseline setup and six-month performance tracking.
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

## Team Ownership (4 Members)
- Member 1
  Primary Subsystem: `S1: Identity, Access, and Security`
  Core Modules: `S1-M1`, `S1-M2`, `S1-M3`
  Dependencies/Handoffs: Provides centralized auth validation interfaces for S2, S3, and S4 (`INT-06`, `INT-07`, `INT-08`, `INT-09`, `INT-10`, `INT-11`); provides RBAC and audit foundation to all subsystems.
- Member 2
  Primary Subsystem: `S2: Applicant Portal and Guidance`
  Core Modules: `S2-M1`, `S2-M2`, `S2-M3`
  Dependencies/Handoffs: Requests and consumes auth validation from S1 (`INT-06`, `INT-07`); sends intake package to S3 (`INT-01`); consumes verification and decision outputs from S3/S4 (`INT-02`, `INT-04`).
- Member 3
  Primary Subsystem: `S3: AI Verification and Pre-Screening`
  Core Modules: `S3-M1`, `S3-M2`, `S3-M3`
  Dependencies/Handoffs: Requests and consumes auth validation from S1 (`INT-08`, `INT-09`); consumes intake package from S2; returns verification output to S2 and S4 (`INT-02`, `INT-03`).
- Member 4
  Primary Subsystem: `S4: Officer Workflow, Decisioning, and Analytics`
  Core Modules: `S4-M1`, `S4-M2`, `S4-M3`
  Dependencies/Handoffs: Requests and consumes auth validation from S1 (`INT-10`, `INT-11`); consumes verification output from S3; sends decision records to S2; aggregates KPI events from S2/S3/S4 (`INT-04`, `INT-05`).

## Objective Traceability Matrix
- O1: Online platform with AI pre-verification
  Measurable Target: AI pre-screen runs before officer review for submitted applications.
  Primary Requirement Coverage: `S1-FR-07`, `S2-FR-01`, `S2-FR-03`, `S2-FR-12`, `S3-FR-01`, `S3-FR-04`, `S3-FR-08`, `S4-FR-01`, `INT-01`, `INT-03`, `INT-06`, `INT-07`, `INT-08`, `INT-09`
- O2: Reduce incomplete applications by >=60%
  Measurable Target: Incomplete-rate reduction against baseline reaches >=60% within monitored period.
  Primary Requirement Coverage: `S2-FR-03`, `S2-FR-04`, `S2-FR-06`, `S2-FR-09`, `S3-FR-02`, `S3-FR-04`, `S4-FR-07`, `S4-FR-08`, `S4-FR-09`, `INT-05`
- O3: Reduce processing time within 6 months
  Measurable Target: Cycle-time trend decreases from baseline within 6 months after implementation.
  Primary Requirement Coverage: `S1-FR-06`, `S1-FR-07`, `S1-FR-08`, `S2-FR-10`, `S2-FR-12`, `S3-FR-06`, `S3-FR-07`, `S3-FR-08`, `S4-FR-01`, `S4-FR-02`, `S4-FR-08`, `S4-FR-11`, `S4-NFR-03`, `INT-04`, `INT-05`, `INT-06`, `INT-07`, `INT-08`, `INT-09`, `INT-10`, `INT-11`
