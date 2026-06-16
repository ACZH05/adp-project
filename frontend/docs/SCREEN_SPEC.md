# SCREEN_SPEC.md

## 1. Purpose
This document provides a detailed technical specification for each screen in the Automated Document Processing (ADP) system. It serves as the primary implementation guide for frontend developers to translate Figma designs into Next.js and Tailwind CSS components while maintaining strict adherence to the design system and functional requirements.

## 2. Source Files
- **Figma Screenshots:** `frontend/docs/screenshots/*.png`
- **Design System:** `frontend/docs/DESIGN.md`
- **Functional Requirements:** `frontend/docs/UI_REQUIREMENTS.md`
- **Coding Standards:** `frontend/AGENTS.md`

## 3. Global Layout Patterns
- **Applicant Portal:** Centered content with generous whitespace for forms; dashboard with top navigation and side activity timeline.
- **Officer Portal:** Sidebar navigation (left) with primary content area (right); high-density data tables and multi-panel review layouts.
- **Responsiveness:**
    - Desktop (>1024px): Full layout (Sidebar/Grid).
    - Tablet (768px - 1023px): Margins reduced to 1.5rem; tables scroll horizontally.
    - Mobile (<767px): Single-column stacks; top-navigation only; 1rem margins.

## 4. Shared Components
- **Buttons:** Primary (Deep Navy), Secondary (Slate-100), Ghost (No BG), Red-outline (Danger).
- **Inputs:** Top-aligned labels, 4px border-radius, red error states with icons.
- **Badges/Pills:** Pill-shaped status indicators with tinted backgrounds.
- **Cards:** Surface-1 (White, 1px Slate-200 border, 8px radius).
- **Stepper:** Vertical progress indicator with icons/checkmarks.
- **Modal/Panels:** Right-aligned side-panels for quick review or decisioning.

## 5. Screen Specs

### 5.1 Login/Register
#### Purpose
Entry point for applicants to access their applications and for officers to access the management portal.
#### Source Reference
`Register - Applicant Portal.png`
#### Layout Hierarchy
- Full-page background (Cool Slate gradient)
- Centered Login/Register Card (Surface-1)
#### Component Order
- Branding Icon
- Header & Sub-header
- Tab Switcher (Sign In / Register)
- Form Container
- Primary Action Button
- Support Footer Link
#### Visible Text / Labels
- "Entertainment Portal"
- "Manage your event licenses and permits."
- "Sign In", "Register"
- "Email Address", "Password", "Forgot Password?"
- "Need technical support? Contact Help Desk"
#### Fields and Controls
- Email Input: Placeholder "applicant@example.com", shows red border/icon on error.
- Password Input: Masked, with visibility toggle (eye icon).
#### Actions
- "Sign In ->": Submits credentials.
- "Register" Tab: Switches to registration form.
#### States
- **Error:** Inline red text "Please enter a valid email address format."
#### Reusable Components
- `AuthCard`, `Button`, `TextInput`

---

### 5.2 Applicant Dashboard
#### Purpose
Central hub for applicants to track progress and manage their license lifecycle.
#### Source Reference
`Applicant Dashboard.png`
#### Layout Hierarchy
- Top Navigation Bar
- Page Header (License Type + ID)
- Two-Column Grid (Main: 8/12, Sidebar: 4/12)
#### Component Order
- **Main (Left):**
    - AI Status Banner (Progress bar + text)
    - Summary Cards (Required Documents, Fees)
    - Action Card (Upcoming Inspection)
- **Sidebar (Right):**
    - Activity Timeline (Vertical Stepper)
#### Visible Text / Labels
- "Application Dashboard"
- "Food Establishment License - Ref #FE-2024-88A"
- "AI Verification in Progress" (45% Complete)
- "Activity Timeline"
#### Fields and Controls
- Progress Bar (Yellow for in-progress).
#### Actions
- "View Documents ->": Navigates to document list.
- "Download Receipt ->": Triggers file download.
- "Reschedule": Opens appointment manager.
- "Prepare": Navigates to inspection guide.
#### States
- **Empty:** Show "No active applications" placeholder.
- **Loading:** Shimmer effect on cards and timeline.
#### Reusable Components
- `TopNav`, `StatusBanner`, `SummaryCard`, `TimelineStepper`

---

### 5.3 Application Wizard Flow (Steps 1-6)
#### Purpose
Guided multi-step form for license submission.
#### Source Reference
`Application Wizard - Step 1_ Applicant Info.png` to `Application Wizard - Step 3_ Premise Info.png` and variations.
#### Layout Hierarchy
- Global Wizard Header
- Two-Column Layout (Sidebar: 3/12 Stepper, Content: 9/12 Form)
#### Component Order
- **Sidebar:**
    - Vertical Stepper (Steps 1-6)
    - Contextual Info Box (e.g., "Ensure all details match...")
- **Content:**
    - Step Title & Description
    - Form Field Groups
    - Navigation Actions (Back/Next)
#### Fields and Controls
- **Step 1:** Full Name, IC, DOB (Datepicker), Email, Contact, Address block.
- **Step 2:** Business Name, Position, Phone, Reg Date, Expiry, Reg Number, Address.
- **Step 3:** Premise Address (Textarea), Postcode, City/District (Read-only auto-detect), Premise Type, Floor.
- **Step 4:** Category Dropdown, Quantity/Capacity, Duration (Months), Operating Hours (Start/End timepickers).
- **Step 5:** Upload zones with file icons and "Verified" checkmarks.
- **Step 6:** Signatory details, Read-only declaration box, Checkbox with "Declared At" badge.
#### Actions
- "Next Step": Validates current step and moves forward.
- "Back": Moves to previous step (data persists).
- "Save draft & Exit": Persists draft and returns to dashboard.
- "Submit": Finalizes application and enqueues AI job.
#### Reusable Components
- `WizardStepper`, `AddressBlock`, `FileUploadZone`, `TimePicker`

---

### 5.4 Officer Portal: Application Queue
#### Purpose
Management queue for officers to review and prioritize applications.
#### Source Reference
`Application Queue - Officer Portal.png`
#### Layout Hierarchy
- Left Sidebar Navigation
- Top Header with Search/Filters
- KPI Summary Row
- Data Table
#### Component Order
- KPI Cards (Pending, High Confidence, Urgent, Processed Today)
- Filter Bar (Dropdowns for Status, Type, AI Score)
- High-Density Table (Sortable headers)
#### Fields and Controls
- Search Input: "Search Ref ID or Name..."
- Status Filters: All Active, Pending, etc.
#### Actions
- "+ New Review": Manual case creation.
- Table Row Click: Navigates to individual case review.
- Export Icon: Downloads CSV/PDF report.
#### States
- **Loading:** Table rows show skeleton loaders.
- **Urgent State:** Left-border of table row is red.
#### Reusable Components
- `SideNav`, `KPICard`, `DataTable`, `FilterBar`

---

### 5.5 Officer Portal: Review Application
#### Purpose
Detailed review page where officers audit AI findings and make a final decision.
#### Source Reference
`Review Application - Officer Portal.png`
#### Layout Hierarchy
- Three-Panel Layout (Left: Details, Middle: AI Analysis, Right: Decision)
#### Component Order
- **Left Panel:** Business/Usage Details, Submitted Documents list with status icons.
- **Middle Panel:** AI Analysis Cards (Severity color-coded).
- **Right Panel:** Decision Buttons, Internal Notes textarea.
#### Visible Text / Labels
- "Automated Review Analysis"
- "Critical Discrepancy Detected" (Severity: High)
- "Officer Decision"
#### Actions
- "Approve Application": Success flow.
- "Request Correction": Red-outline action, opens reason modal.
- "Reject": Ghost action, opens rejection modal.
- "View Document": Opens document in overlay/new tab.
#### Reusable Components
- `DetailsPanel`, `AIAnalysisCard`, `DecisionPanel`

---

### 5.6 Officer Portal: Analytics Dashboard
#### Purpose
Real-time monitoring of system-wide performance and AI efficiency.
#### Source Reference
`Analytics Dashboard - Officer Portal.png`
#### Layout Hierarchy
- Top KPI Summary
- Middle Chart Grid (2-column)
- Bottom "Live Queue Readout" Table
#### Component Order
- KPI Summary (Total Apps, Approved, Pending, Rejected)
- Bar Chart: Monthly Application Volume
- Line Chart: AI Processing Time (with Beta badge)
- Table: Live Queue status (Real-time updates indicator)
#### Visible Text / Labels
- "Analytics Overview"
- "1.2s Average per document"
#### Reusable Components
- `ChartContainer`, `LiveTable`, `MetricCard`

## 6. Reusable Component Map
| Component | Location | Notes |
| :--- | :--- | :--- |
| `Button` | `shared/components` | Variants: Primary, Secondary, Ghost, Danger |
| `TextInput` | `shared/components` | Supports icons, error states, labels |
| `Badge` | `shared/components` | Color-coded by status (Success, Warning, Error, Info) |
| `Card` | `shared/components` | Standard padding 1.5rem, Surface-1 style |
| `Sidebar` | `shared/components` | Collapsible on tablet/mobile |
| `Stepper` | `shared/components` | Vertical layout for Wizard and Dashboard |

## 7. Notes / Assumptions
- **Step Mapping Correction:** Image `Application Wizard - Step 4_ Entertainment Details (2).png` is mapped to **Step 5: Document Upload**. Image `(1).png` is mapped to **Step 6: Declaration**.
- **Real-time:** The "Live Queue Readout" and Dashboard status banners assume Supabase Realtime integration.
- **Auth:** Admin/Officer login uses the same screen as Applicants but with different role-based redirection.
- **Styling:** All spacing follows the 8px vertical rhythm and 24px gutter defined in `DESIGN.md`.
