# UI Requirements Specification

This document defines the functional requirements for each screen in the Automated Document Processing (ADP) system. These requirements bridge the backend business logic and the frontend user experience.

---

## 1. Login/Register Screen
**Purpose:** Provide secure entry and account creation for applicants. Officers/Admins are invited via pre-registered emails.

*   **Required UI Sections:**
    *   Auth Toggle (Switch between Login and Registration)
    *   Authentication Form
    *   Help/Support Link
*   **Required Fields:**
    *   `Email Address` (Required, email format)
    *   `Password` (Required, masked)
*   **User Actions:**
    *   `Sign In`: Authenticates user and redirects to Dashboard.
    *   `Register`: Creates new applicant account (applicant role by default).
    *   `Forgot Password`: Initiates password reset flow.
*   **States:**
    *   `Error`: Invalid credentials, malformed email, or password mismatch on registration.
    *   `Loading`: Processing authentication request.
*   **Acceptance Criteria:**
    *   Only pre-invited emails can register as Admins/Officers (S1-FR-04).
    *   Login failures must be logged for security (S1-NFR-01).

---

## 2. Applicant Dashboard
**Purpose:** Provide applicants with a central view of their application status, next steps, and historical activity.

*   **Required UI Sections:**
    *   Global Navigation (Dashboard, Applications, Appointments)
    *   Real-time Application Status Banner
    *   Status/Summary Cards (Documents, Fees)
    *   Next Action/Upcoming Event Card
    *   Activity Timeline
*   **Required Fields:**
    *   `License Type & Reference ID` (Read-only)
    *   `AI Processing Status` (Percentage/Progress bar)
    *   `Document Verification Summary` (e.g., "3/4 Approved")
*   **User Actions:**
    *   `View Documents`: Link to detailed document status page.
    *   `Download Receipt`: Export payment proof.
    *   `Reschedule/Prepare`: Manage appointments/inspections.
*   **States:**
    *   `Empty`: Displayed when no applications have been started.
    *   `Real-time Updates`: Status changes must propagate without refresh (S2-FR-10).
*   **Acceptance Criteria:**
    *   Must only show data belonging to the authenticated applicant (S1-NFR-05).
    *   Must show "Upcoming Inspection" eligibility only if application is approved (S5-FR-01).

---

## 3. Application Wizard Flow
**Purpose:** Multi-step guided intake for entertainment license applications with integrated pre-validation.

### Step 1: Applicant Info
*   **Fields:** Full Name, IC/Passport Number, Date of Birth, Email, Contact Number, Full Residential Address.
*   **Actions:** Next Step, Save Draft.
*   **Criteria:** Must validate IC format and mandatory fields (S2-FR-03).

### Step 2: Business Info
*   **Fields:** Business Legal Name, Position, Phone, Reg Date, Expiry Date, Reg Number, Full Business Address.
*   **Actions:** Back, Next Step, Save Draft.

### Step 3: Premise Info
*   **Fields:** Premise Address (Textarea), Postcode, City/District (Auto-detect), Premise Type (Dropdown), Floor Level.
*   **Actions:** Back, Next Step, Save Draft.

### Step 4: Entertainment Details
*   **Fields:** Primary Type, Quantity/Capacity, Quantity Unit, Requested Duration (Months), Operating Hours (Start/End).
*   **Actions:** Back, Next Step, Save Draft.

### Step 5: Document Upload
*   **Required Sections:** Categorized dropzones (Passport Photo, IC Copy, Business Reg, Tenancy Agreement, etc.).
*   **Actions:** File Drag-and-Drop, File Delete, Next Step.
*   **States:** `Uploading`, `Verified`, `Low Confidence/Flagged`.
*   **Criteria:** Files must be stored in scoped Supabase paths (S2-FR-02).

### Step 6: Declaration
*   **Fields:** Signatory Full Name, IC Number, Company Name.
*   **Required Sections:** Legal Declaration Text, Confirmation Checkbox.
*   **Actions:** Back, Submit (Final).
*   **Criteria:** Submission must enqueue a `VerificationJobPayload` for the AI engine (INT-01).

---

## 4. Officer Portal

### Application Queue
*   **Purpose:** Allow officers to manage and prioritize incoming license requests.
*   **Required UI Sections:**
    *   Summary KPI Cards (Pending, AI-Ready, Flagged, Today's Progress)
    *   Filter Bar (Status, Type, AI Score)
    *   Applications Table
*   **Fields in Table:** Ref ID, Applicant Name, Type, Submission Date, Status, AI Confidence Score.
*   **User Actions:** Search, Filter, Sort, Select Case for Review.
*   **Criteria:** Must enforce Role-Based Access Control (S1-FR-05).

### Review Application
*   **Purpose:** Detailed case review including AI-generated insights and document inspection.
*   **Required UI Sections:**
    *   Applicant/Business Details Summary
    *   Document List (with inline view/download)
    *   AI Findings Panel (Highlighted discrepancies, zoning alerts)
    *   Decision Panel (Approve, Request Correction, Reject)
    *   Internal Notes
*   **User Actions:** `Approve`, `Request Correction` (with mandatory reason), `Reject` (with mandatory reason), `View Document`.
*   **Acceptance Criteria:** Every decision must be recorded in the audit trail (S4-FR-04).

### Analytics Dashboard
*   **Purpose:** High-level monitoring of system performance and KPI tracking.
*   **Required UI Sections:**
    *   Top-line KPIs (Total, Approved, Pending, Rejected)
    *   Volume Charts (Bar/Line)
    *   Queue Performance Metrics (Wait times, AI processing times)
    *   Live Queue Readout
*   **User Actions:** Date Range Selection, Export Report (S4-FR-10).
*   **Acceptance Criteria:** Must display progress against target goals (e.g., 60% reduction in incomplete apps) (S4-FR-09).
