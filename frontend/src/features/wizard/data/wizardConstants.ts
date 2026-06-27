export const WIZARD_STEPS = [
  { number: 1, title: 'Applicant Info', description: 'Personal details and credentials' },
  { number: 2, title: 'Business Info', description: 'Registered entity information' },
  { number: 3, title: 'Premise Info', description: 'Location and establishment details' },
  { number: 4, title: 'Entertainment Details', description: 'Operating category and hours' },
  { number: 5, title: 'Document Upload', description: 'Upload verified supporting files' },
  { number: 6, title: 'Declaration', description: 'Legal undertaking and sign-off' },
] as const;

export const WIZARD_STEP_TIPS: Record<number, string> = {
  1: 'Ensure your Full Name and Identity Card / Passport details match exactly with the submitted identification documents in Step 5.',
  2: 'Please ensure your SSM Registration number is active and matches legal records. Expired business profiles will require manual override.',
  3: 'Enter the physical location of the entertainment. The system auto-resolves District and Postcode mapping to check zoning requirements.',
  4: 'Entertainment types have varying fee structures and operating permits. Standard permits allow operating hours up to 02:00 AM.',
  5: 'Files are processed instantly. Our AI scanner detects text legibility, company seals, and signatures. Review flagged alerts before submission.',
  6: 'Double-check all information before signing. Once submitted, your application will enqueue in the officer portal queue and cannot be edited.',
};

export const REQUIRED_DOCUMENT_TYPES = [
  {
    key: 'passportPhoto',
    label: 'Passport-Sized Photo',
    description: 'Recent photograph with a white background (JPEG/PNG, max 2MB).',
    accept: 'image/jpeg,image/png',
  },
  {
    key: 'icCopy',
    label: 'Identity Card / Passport Copy',
    description: 'Clear copy of front & back of IC or biodata page of Passport (PDF/JPEG/PNG, max 5MB).',
    accept: 'application/pdf,image/jpeg,image/png',
  },
  {
    key: 'businessReg',
    label: 'Business Registration Certificate (SSM)',
    description: 'Full corporate registration document profile (PDF format, max 10MB).',
    accept: 'application/pdf',
  },
  {
    key: 'tenancyAgreement',
    label: 'Tenancy Agreement / Premise Usage Proof',
    description: 'Signed agreement showing permission to use the establishment (PDF, max 10MB).',
    accept: 'application/pdf',
  },
] as const;
