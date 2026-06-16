---
name: Civic Precision
colors:
  surface: '#faf9fd'
  surface-dim: '#dad9dd'
  surface-bright: '#faf9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f7'
  surface-container: '#efedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e6'
  on-surface: '#1a1b1e'
  on-surface-variant: '#44474e'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f4'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#002046'
  on-primary: '#ffffff'
  primary-container: '#1b365d'
  on-primary-container: '#87a0cd'
  inverse-primary: '#aec7f7'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#321c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#4f2f00'
  on-tertiary-container: '#c6965e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f7'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2e476f'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#ffddb9'
  tertiary-fixed-dim: '#f1bd81'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#623f0f'
  background: '#faf9fd'
  on-background: '#1a1b1e'
  surface-variant: '#e3e2e6'
  success-green: '#166534'
  warning-amber: '#B45309'
  error-red: '#991B1B'
  info-blue: '#0369A1'
  border-muted: '#CBD5E1'
  text-main: '#0F172A'
  text-muted: '#475569'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: Courier Prime
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  margin-page: 2rem
  gutter-grid: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
  container-max-width: 1280px
---

## Brand & Style

The design system is engineered for **GovTech efficiency**, prioritizing clarity, legal authority, and public trust. It serves two primary audiences: citizens navigating complex regulatory requirements and government officers processing high volumes of data. The emotional response is one of "calm competence"—the interface should feel secure, unbreakable, and meticulously organized.

The aesthetic follows a **Corporate / Modern** movement with a lean toward **Functional Minimalism**. It avoids decorative flourishes in favor of structural integrity. Every element is intentional, designed to reduce the cognitive load of dense data entry and bureaucratic review. The visual language utilizes a structured grid, clear information hierarchy, and high-contrast signaling to ensure accessibility and professional rigor.

## Colors

The palette is anchored by a **Deep Navy (#1B365D)**, selected to evoke the stability and authority of a governmental institution. This primary color is used for navigation, headers, and primary actions to anchor the user's focus.

Functional signaling is handled by high-contrast semantic colors:
- **Success Green:** Used for "Approved" statuses and successful file uploads.
- **Warning Amber:** Specifically calibrated for "Correction Required" states, ensuring high visibility without the alarmism of red.
- **Error Red:** Reserved for critical failures, rejected applications, or data validation errors.

The background system utilizes a "Cool Slate" spectrum to differentiate between page levels and container surfaces, maintaining a crisp, clinical environment for data review.

## Typography

This design system utilizes **Inter** for all UI elements to take advantage of its exceptional legibility in data-heavy contexts. The hierarchy is strictly enforced to guide users through multi-step forms and complex tables.

- **Headlines:** Use tighter letter-spacing and heavier weights to establish clear section boundaries.
- **Body Text:** Optimized for long-form reading of terms, conditions, and officer notes.
- **Labels:** Set in semi-bold at smaller sizes to clearly identify form fields and metadata without competing with user-entered data.
- **Monospace:** `Courier Prime` is used sparingly for Application IDs and checksums to distinguish system-generated strings from human-readable text.

## Layout & Spacing

The system employs a **Fixed Grid** layout for desktop to ensure data density remains readable and consistent. 

- **Grid:** A 12-column grid with a 24px (1.5rem) gutter. 
- **Rhythm:** A base-8 vertical rhythm is used. Generous white space is applied between major form sections (`stack-lg`) to prevent "form fatigue."
- **Responsive Behavior:** 
    - **Desktop (>1024px):** Side navigation for officers; 12-column layout.
    - **Tablet (768px - 1023px):** Content scales to 8 columns; margins reduce to 1.5rem.
    - **Mobile (<767px):** Content reflows to a single column; 1rem margins; top-navigation only.

Form fields should be grouped logically into containers, using consistent internal padding (1.5rem) to maintain a structured "block" feel.

## Elevation & Depth

To maintain an authoritative and "flat" professional feel, the design system avoids heavy shadows and skeuomorphism. Instead, it uses **Tonal Layers** and **Low-contrast Outlines**:

- **Surface 0 (Background):** Used for the main app background (Slate-50).
- **Surface 1 (Cards/Containers):** Pure white with a 1px solid border (Slate-200).
- **Surface 2 (Active/Hover):** Subtle depth is added only to interactive elements using a very soft, high-diffusion shadow (0px 4px 12px rgba(0,0,0,0.05)).
- **Separation:** Section headers use a subtle horizontal rule rather than elevation to denote hierarchy.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding takes the edge off the "brutal" nature of government forms while maintaining a geometric, precise character. 

- **Standard Elements:** Input fields, buttons, and checkboxes use a 4px (0.25rem) radius.
- **Containers:** Large cards use 8px (0.5rem) to provide a clear frame for content groups.
- **Status Badges:** Use a pill-shape (full rounding) to differentiate status indicators from interactive buttons.

## Components

### Buttons
- **Primary:** Deep Navy background, White text. High-contrast.
- **Secondary:** Slate-100 background, Navy text. For "Save Draft" or "Previous."
- **Ghost:** No background, Navy text. For "Cancel" or "View Audit Log."

### Status Badges
Badges use a "Tinted-Background/High-Contrast-Text" pattern:
- **Approved:** Light Green background / Deep Green text.
- **Correction Required:** Light Amber background / Deep Amber text.
- **Draft:** Light Gray background / Slate text.

### Data Tables
Structured for high-density review. Rows use a fixed height with 12px vertical padding. Use zebra-striping (Slate-50) on alternate rows to maintain tracking across wide screens.

### Multi-Step Wizards
Located at the top of application flows. Steps are numbered and titled. Completed steps show a green checkmark; current steps have a thick navy bottom border.

### File Upload Zones
Dashed 1px border (Slate-300). On hover, the border changes to Primary Navy. Clear validation state displays document type (e.g., "Identity Card Copy") and "Verified" or "Low Confidence" status immediately below the filename.

### Input Fields
Labels are always top-aligned. Required fields are marked with a subtle red asterisk. Help text is placed below the input in `body-md` muted text.