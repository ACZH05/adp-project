# SCREEN_SPEC.md

## 1. Purpose
This document provides a detailed technical specification for each screen in the Automated Document Processing (ADP) system. It serves as the primary implementation guide for frontend developers to translate Figma designs into Next.js and Tailwind CSS components while maintaining strict adherence to the design system and functional requirements.

## 2. Source Files
- **Figma Screenshots:** `frontend/docs/screenshots/*.png`
- **Design System:** `frontend/docs/Design.md`
- **Functional Requirements:** `frontend/docs/UI_REQUIREMENTS.md`
- **Coding Standards:** `frontend/AGENTS.md`

## 3. Global Layout Patterns
- **Applicant Portal:** Centered content with generous whitespace for forms; dashboard with top navigation and side activity timeline.
- **Officer Portal:** Sidebar navigation (left) with primary content area (right); high-density data tables and multi-panel review layouts.
- **Responsiveness:**
    - **Desktop (>1024px):** Full layout with sticky sidebar/navigation and multi-column grids.
    - **Tablet (768px - 1023px):** Content scales to 8 columns; margins reduce to 1.5rem; sidebars may collapse into drawer menus.
    - **Mobile (<767px):** Content reflows to a single column; 1rem margins; top-navigation only; horizontal scroll for tables.

## 4. Shared Components
- **Buttons:** Primary (Deep Navy), Secondary (Slate-100), Ghost (No BG), Red-outline (Danger). Standard 4px radius.
- **Inputs:** Top-aligned labels, 4px border-radius, red error states with icons. Uses `Inter` font.
- **Badges/Pills:** Pill-shaped status indicators with tinted backgrounds and high-contrast text.
- **Cards:** Surface-1 (White, 1px Slate-200 border, 8px radius). Internal padding 1.5rem.
- **Stepper:** Vertical progress indicator for Wizard (left) and Dashboard (right).
- **Modal/Panels:** Right-aligned side-panels for quick review or decisioning; standard overlays for confirmation.

## 5. Screen Specs

### 5.1 Login / Register
#### Purpose
Entry point for applicants to access their applications and for officers to access the management portal.
#### Source Reference
`Register - Applicant Portal.png`
#### Route or Page Location
`/auth`
#### Layout Hierarchy
- Full-page background with "Cool Slate" gradient.
- Centered Auth Card (Surface-1).
#### Component Order
- Branding Icon (Logo).
- Title ("Entertainment Portal").
- Subtitle ("Manage your event licenses and permits.").
- Tab Switcher (Sign In / Register).
- Form (Email, Password).
- Action Button ("Sign In ->").
- Footer Support Link.
#### Visible Text / Labels
- "Entertainment Portal", "Sign In", "Register", "Email Address", "Password", "Forgot Password?".
#### Fields and Controls
- `Email`: Text input with placeholder `applicant@example.com`.
- `Password`: Masked input with visibility toggle.
#### Actions
- `Sign In`: Validates and redirects to Dashboard.
- `Register`: Switches view to registration fields.
#### States
- **Loading:** Button shows spinner.
- **Error:** Red border on inputs with "Invalid credentials" message.
#### Responsive Notes
- Mobile: Card takes 100% width with 1rem horizontal margins.
#### Reusable Components
- `AuthCard`, `Button`, `TextInput`.
#### Implementation Notes
- Use `next-auth` or similar for session management.
#### Unclear Details
- Password strength requirements not explicitly defined.

---

### 5.2 Applicant Dashboard
#### Purpose
Central hub for applicants to track progress and manage their license lifecycle.
#### Source Reference
`Applicant Dashboard.png`
#### Route or Page Location
`/dashboard`
#### Layout Hierarchy
- Top Navigation Bar (Sticky).
- Page Header with Breadcrumbs.
- Main content area (8/12 grid).
- Sidebar area (4/12 grid).
#### Component Order
- **Main Area:**
    - AI Status Banner (Progress Bar).
    - Grid of Summary Cards (Documents, Fees).
    - Next Action Card (Upcoming Inspection).
- **Sidebar Area:**
    - Activity Timeline (Vertical Stepper).
#### Visible Text / Labels
- "Application Dashboard", "AI Verification in Progress", "Activity Timeline".
#### Fields and Controls
- `Progress Bar`: Colored (Yellow/Green) based on completion %.
#### Actions
- `View Documents`: Link to `/applications/[id]/documents`.
- `Download Receipt`: Triggers PDF download.
- `Reschedule`: Link to `/appointments/book`.
#### States
- **Empty:** "No active applications found. [Start Application]"
- **Loading:** Card skeletons.
#### Responsive Notes
- Tablet: Sidebar moves below main content.
#### Reusable Components
- `TopNav`, `StatusBanner`, `SummaryCard`, `TimelineStepper`.
#### Implementation Notes
- Use Supabase Realtime for progress bar updates.
#### Unclear Details
- "Fees" card behavior (payment gateway vs. simple status).

---

### 5.3 Application Wizard (Step 1-4)
#### Purpose
Guided intake for license applications.
#### Source Reference
`Application Wizard - Step 1_ Applicant Info.png` to `Application Wizard - Step 4_ Entertainment Details.png`.
#### Route or Page Location
`/apply/[step]`
#### Layout Hierarchy
- Top Wizard Header (Step Counter).
- Two-column layout (3/12 Stepper, 9/12 Form).
#### Component Order
- **Left Column:** Vertical Stepper with 6 steps.
- **Right Column:** 
    - Section Header.
    - Form Fields grouped by context.
    - Navigation Buttons (Back, Next/Submit).
#### Visible Text / Labels
- "Applicant Info", "Business Info", "Premise Info", "Entertainment Details".
#### Fields and Controls
- **Step 1:** Full Name, IC/Passport, DOB, Email, Contact, Residential Address.
- **Step 2:** Business Name, Position, Reg Number, Business Address.
- **Step 3:** Premise Address (Textarea), Premise Type (Select).
- **Step 4:** Category (Select), Capacity (Number), Operating Hours.
#### Actions
- `Next Step`: Proceeds to next step after validation.
- `Back`: Returns to previous step.
- `Save Draft`: Persists data without advancing.
#### States
- **Validation Error:** Inline red messages for mandatory fields.
#### Responsive Notes
- Mobile: Stepper becomes horizontal at top; form is single column.
#### Reusable Components
- `WizardStepper`, `AddressBlock`, `SelectInput`.
#### Implementation Notes
- Local storage or DB draft persistence required.
#### Unclear Details
- "Premise Type" options list.

---

### 5.4 Document Upload (Wizard Step 5)
#### Purpose
Categorized upload of required supporting documents with AI feedback.
#### Source Reference
`Application Wizard - Step 4_ Entertainment Details (2).png`
#### Route or Page Location
`/apply/step-5`
#### Layout Hierarchy
- Same as Wizard Flow.
#### Component Order
- Upload Grid (Categorized Cards).
- Action Buttons.
#### Visible Text / Labels
- "Required Documents", "Upload your files for AI verification".
#### Fields and Controls
- `UploadZone`: Drag-and-drop area for each category (IC, Business Reg, etc.).
#### Actions
- `Upload`: Triggers file picker.
- `Delete`: Removes uploaded file.
#### States
- **Verifying:** Spinner with "AI is checking..."
- **Verified:** Green badge "Verified".
- **Flagged:** Amber badge "Low Confidence".
#### Responsive Notes
- Mobile: Cards stack vertically.
#### Reusable Components
- `FileUploadZone`, `StatusBadge`.
#### Implementation Notes
- Integrates with S3/Supabase Storage.
#### Unclear Details
- Maximum file size limit.

---

### 5.5 Declaration (Wizard Step 6)
#### Purpose
Final legal confirmation and submission.
#### Source Reference
`Application Wizard - Step 4_ Entertainment Details (1).png`
#### Route or Page Location
`/apply/step-6`
#### Layout Hierarchy
- Same as Wizard Flow.
#### Component Order
- Declaration Text (Scrollable).
- Signature Fields.
- Confirmation Checkbox.
- Submit Button.
#### Visible Text / Labels
- "Legal Declaration", "I hereby declare...", "Submit Application".
#### Fields and Controls
- `Signatory Name`: Text.
- `IC Number`: Text.
#### Actions
- `Submit`: Final submission to backend.
#### States
- **Success:** Redirects to `/dashboard` with success modal.
#### Responsive Notes
- Mobile: Scrollable text box height reduces.
#### Reusable Components
- `DeclarationBox`, `Button`.
#### Implementation Notes
- Capture timestamp on submission.
#### Unclear Details
- Digital signature requirement (E-signature vs. just checkbox).

---

### 5.6 My Applications (Applicant)
#### Purpose
Full list of applications for the user.
#### Source Reference
`My Applications - Applicant Portal.png`
#### Route or Page Location
`/applications`
#### Layout Hierarchy
- Standard Dashboard layout with List view.
#### Component Order
- Search/Filter Bar.
- List of Application Cards.
#### Visible Text / Labels
- "My Applications", "Search by Ref ID".
#### Fields and Controls
- `Search`: Text.
- `Status Filter`: Dropdown.
#### Actions
- `View Details`: Links to specific dashboard.
#### States
- **No Results:** Empty state illustration.
#### Responsive Notes
- Mobile: Cards show minimal info; "View Details" is full width.
#### Reusable Components
- `ApplicationCard`, `FilterDropdown`.
#### Implementation Notes
- Paginated list.
#### Unclear Details
- Sorting options (Date, Status).

---

### 5.7 Book Appointment (Applicant)
#### Purpose
Scheduling for physical visits.
#### Source Reference
`Book Appointment - Applicant Portal.png`
#### Route or Page Location
`/appointments/book`
#### Layout Hierarchy
- Wizard-style scheduling flow.
#### Component Order
- Calendar Picker.
- Time Slot Grid.
- Confirmation Summary.
#### Visible Text / Labels
- "Schedule Appointment", "Select Date".
#### Fields and Controls
- `Calendar`: Interactive date selection.
- `Time Slots`: Selectable chips/cards.
#### Actions
- `Confirm`: Submits request.
#### States
- **Busy:** Slot is disabled.
#### Responsive Notes
- Mobile: Calendar and Time Grid stack.
#### Reusable Components
- `CalendarPicker`, `TimeSlotGrid`.
#### Implementation Notes
- Conflict checking required on frontend/backend.
#### Unclear Details
- Maximum number of appointments per user.

---

### 5.8 Application Queue (Officer)
#### Purpose
Main task list for officers.
#### Source Reference
`Application Queue - Officer Portal.png`
#### Route or Page Location
`/officer/queue`
#### Layout Hierarchy
- Left Sidebar Navigation (Sticky).
- Top Filter Bar.
- Main Data Table.
#### Component Order
- KPI Summary Row (4 cards).
- Search/Filter Row.
- High-Density Data Table.
#### Visible Text / Labels
- "Pending Review", "High Confidence", "Urgent Cases".
#### Fields and Controls
- `Table`: Rows with status badges and AI scores.
#### Actions
- `Row Click`: Navigate to Review Page.
- `Filter`: Multi-select dropdowns.
#### States
- **Urgent:** Row highlight in red.
#### Responsive Notes
- Desktop only primary view; Tablet/Mobile requires horizontal scroll.
#### Reusable Components
- `SideNav`, `DataTable`, `KPICard`.
#### Implementation Notes
- Role-based access control (RBAC) check.
#### Unclear Details
- Bulk actions (e.g., bulk approve).

---

### 5.9 Review Application (Officer)
#### Purpose
Detailed audit and decision-making screen.
#### Source Reference
`Review Application - Officer Portal.png`
#### Route or Page Location
`/officer/review/[id]`
#### Layout Hierarchy
- Multi-pane dashboard (3 columns).
#### Component Order
- **Left:** Application Details & Documents.
- **Center:** AI Analysis & Flagged Items.
- **Right:** Decision Panel & Audit Log.
#### Visible Text / Labels
- "Automated Review Analysis", "Officer Decision".
#### Fields and Controls
- `Notes`: Textarea for internal comments.
#### Actions
- `Approve`: Confirms application.
- `Request Correction`: Opens reason modal.
- `Reject`: Opens rejection modal.
#### States
- **Success/Fail Badge:** Shown next to documents.
#### Responsive Notes
- Desktop only recommended.
#### Reusable Components
- `DocumentViewer`, `AIAnalysisCard`, `DecisionPanel`.
#### Implementation Notes
- Inline PDF/Image viewer for documents.
#### Unclear Details
- Ability to override AI flags.

---

### 5.10 Appointment Dashboard (Officer)
#### Purpose
Manage visit schedules.
#### Source Reference
`Appointment Dashboard - Officer Portal.png`
#### Route or Page Location
`/officer/appointments`
#### Layout Hierarchy
- Sidebar + List/Calendar view.
#### Component Order
- Appointment List (Pending).
- Master Calendar.
#### Visible Text / Labels
- "Appointment Management".
#### Fields and Controls
- `Action Buttons`: Approve/Reschedule on list items.
#### Actions
- `Approve Slot`: Notifies applicant.
#### States
- **Conflicted:** Red warning on calendar slots.
#### Responsive Notes
- Desktop optimized.
#### Reusable Components
- `FullCalendar`, `AppointmentTable`.
#### Implementation Notes
- Syncs with officer availability.
#### Unclear Details
- Integration with external calendars (Google/Outlook).

---

### 5.11 Analytics Dashboard (Officer)
#### Purpose
Performance monitoring.
#### Source Reference
`Analytics Dashboard - Officer Portal.png`
#### Route or Page Location
`/officer/analytics`
#### Layout Hierarchy
- Grid of charts and metrics.
#### Component Order
- Top metrics row.
- Charts area (Bar, Pie).
- Live Queue Table.
#### Visible Text / Labels
- "Analytics Overview", "AI Accuracy".
#### Fields and Controls
- `Date Range`: Selection.
#### Actions
- `Export Report`: CSV/PDF.
#### States
- **Real-time:** "Live" pulsing icon.
#### Responsive Notes
- Desktop focus.
#### Reusable Components
- `ChartContainer`, `MetricCard`.
#### Implementation Notes
- Use `Chart.js` or `Recharts`.
#### Unclear Details
- Data refresh frequency.

## 6. Reusable Component Map
| Component | Purpose | Figma Visual Reference |
| :--- | :--- | :--- |
| `Button` | Standard interaction | Primary: Deep Navy, 4px radius |
| `TextInput` | Data entry | Label top-aligned, Slate-200 border |
| `StatusBadge` | Feedback | Pill shape, tinted background |
| `AuthCard` | Auth container | Surface-1, centered |
| `SideNav` | Officer navigation | Slate-900 BG, icon + text |
| `KPICard` | Summary metrics | Bordered, large numeric value |
| `DataTable` | List management | Zebra striping, fixed header |
| `WizardStepper` | Form progress | Vertical list with circle icons |
| `UploadZone` | File handling | Dashed border, hover effect |

## 7. Notes / Assumptions
- **Responsive:** While mobile is supported, the Officer Portal is primarily designed for large desktop displays due to data density.
- **Color Palette:** Strictly follows the "GovTech" theme from `Design.md`.
- **Navigation:** Applicant portal uses top navigation; Officer portal uses side navigation.
- **AI Feedback:** Real-time feedback is expected during Step 5 of the Wizard.
- **Routes:** Route paths are inferred from common Next.js patterns and screenshot titles.
