import { Application } from './mockApplications';

export interface DocumentDetail {
  id: string;
  name: string;
  category: string;
  status: 'Verified' | 'Low Confidence' | 'Flagged' | 'Pending';
  aiConfidence: number;
  fileName: string;
  fileSize: string;
  uploadedDate: string;
  contentPreview?: string; // Simulated text content for document viewer
  highlights?: string[]; // Areas to highlight or call out
}

export interface AIAnalysisFinding {
  id: string;
  severity: 'High' | 'Medium' | 'Low';
  category: 'Discrepancy' | 'Zoning' | 'Document Quality' | 'Verification';
  title: string;
  description: string;
  field: string;
  suggestedAction: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  notes?: string;
}

export interface ApplicationDetail extends Application {
  // Applicant details
  icNumber: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  
  // Business details
  businessName: string;
  businessRegNumber: string;
  businessPosition: string;
  businessPhone: string;
  businessRegDate: string;
  businessExpiryDate: string;
  businessAddress: string;
  
  // Premise details
  premiseAddress: string;
  premisePostcode: string;
  premiseCity: string;
  premiseType: string;
  premiseFloorLevel: string;
  
  // Entertainment Details
  entertainmentCategory: string;
  entertainmentCapacity: number;
  entertainmentCapacityUnit: string;
  entertainmentDurationMonths: number;
  entertainmentOperatingHours: string;
  
  // Documents
  documents: DocumentDetail[];
  
  // AI Findings
  aiFindings: AIAnalysisFinding[];
  
  // Audit logs
  auditLogs: AuditLogEntry[];
}

const mockApplicationDetails: Record<string, ApplicationDetail> = {
  "APP-2026-001": {
    id: "APP-2026-001",
    applicantName: "Sarah Lim",
    licenseType: "Entertainment License",
    submissionDate: "2026-06-17",
    status: "AI-Ready",
    aiConfidence: 94,
    isUrgent: false,
    icNumber: "S9012345A",
    email: "sarah.lim@gmail.com",
    phone: "+65 9123 4567",
    dob: "1990-04-12",
    address: "Blk 123 Toa Payoh Lorong 1, #08-123, Singapore 310123",
    businessName: "Lim & Tan Entertainment Group Pte. Ltd.",
    businessRegNumber: "202012345M",
    businessPosition: "Managing Director",
    businessPhone: "+65 6789 0123",
    businessRegDate: "2020-05-15",
    businessExpiryDate: "2027-05-15",
    businessAddress: "10 Anson Road, #26-04 International Plaza, Singapore 079903",
    premiseAddress: "30 Victoria Street, #01-15 CHIJMES, Singapore 187996",
    premisePostcode: "187996",
    premiseCity: "Central District",
    premiseType: "Commercial Complex",
    premiseFloorLevel: "Level 1",
    entertainmentCategory: "Live Music Venue / Lounge",
    entertainmentCapacity: 120,
    entertainmentCapacityUnit: "persons",
    entertainmentDurationMonths: 12,
    entertainmentOperatingHours: "18:00 - 02:00 (Daily)",
    documents: [
      {
        id: "DOC-001",
        name: "Identity Card Copy",
        category: "Identity Verification",
        status: "Verified",
        aiConfidence: 98,
        fileName: "nric_sarah_lim.pdf",
        fileSize: "1.2 MB",
        uploadedDate: "2026-06-17",
        contentPreview: "REPUBLIC OF SINGAPORE IDENTITY CARD\nIdentity No: S9012345A\nName: SARAH LIM MIN\nRace: CHINESE\nDate of Birth: 12-04-1990\nSex: F\nCountry of Birth: SINGAPORE\nAddress: BLK 123 TOA PAYOH LORONG 1, #08-123, SINGAPORE 310123",
      },
      {
        id: "DOC-002",
        name: "Business Registration (ACRA)",
        category: "Corporate Registration",
        status: "Verified",
        aiConfidence: 96,
        fileName: "acra_lim_tan_entertainment.pdf",
        fileSize: "2.4 MB",
        uploadedDate: "2026-06-17",
        contentPreview: "ACRA BUSINESS PROFILE\nRegistration No: 202012345M\nEntity Name: LIM & TAN ENTERTAINMENT GROUP PTE. LTD.\nIncorporation Date: 15/05/2020\nRegistered Address: 10 ANSON ROAD, #26-04 INTERNATIONAL PLAZA, SINGAPORE 079903\nPrincipal Activities: BARS, PUBS AND CABARETS\nDirectors: SARAH LIM MIN (appointed 15/05/2020)",
      },
      {
        id: "DOC-003",
        name: "Tenancy Agreement",
        category: "Premise Right of Use",
        status: "Verified",
        aiConfidence: 89,
        fileName: "tenancy_agreement_chijmes.pdf",
        fileSize: "4.8 MB",
        uploadedDate: "2026-06-17",
        contentPreview: "TENANCY AGREEMENT\nLANDLORD: CHIJMES INVESTMENT PTE. LTD.\nTENANT: LIM & TAN ENTERTAINMENT GROUP PTE. LTD.\nPREMISE: 30 VICTORIA STREET, #01-15, SINGAPORE 187996\nTERM: 3 Years commencing 01/01/2025 and expiring 31/12/2027\nMONTHLY RENT: S$12,000",
      }
    ],
    aiFindings: [
      {
        id: "FND-001",
        severity: "Low",
        category: "Discrepancy",
        title: "Slight Name Variation",
        description: "Applicant name on IC is 'Sarah Lim Min' but submission name is 'Sarah Lim'. Verified match via ACRA records and matching ID number.",
        field: "Applicant Name",
        suggestedAction: "Accept slight variation as name match is otherwise complete."
      }
    ],
    auditLogs: [
      {
        id: "LOG-001",
        action: "Application Submitted",
        user: "Applicant (Sarah Lim)",
        timestamp: "2026-06-17 09:30:15"
      },
      {
        id: "LOG-002",
        action: "AI Processing Completed",
        user: "System AI Agent",
        timestamp: "2026-06-17 09:31:02",
        notes: "Automatic classification: AI-Ready. High confidence document check: 94%."
      }
    ]
  },
  "APP-2026-002": {
    id: "APP-2026-002",
    applicantName: "Tan Kah Kee",
    licenseType: "Food Establishment License",
    submissionDate: "2026-06-17",
    status: "Flagged",
    aiConfidence: 38,
    isUrgent: true,
    icNumber: "S7890123B",
    email: "kahkee.tan@foodventures.sg",
    phone: "+65 8234 5678",
    dob: "1978-09-21",
    address: "Blk 456 Jurong West Street 41, #12-456, Singapore 640456",
    businessName: "Kee Food Ventures Pte. Ltd.",
    businessRegNumber: "201854321K",
    businessPosition: "Owner",
    businessPhone: "+65 6123 4567",
    businessRegDate: "2018-10-10",
    businessExpiryDate: "2024-10-10", // Expired!
    businessAddress: "8 Robinson Road, #15-02 ASO Building, Singapore 048544",
    premiseAddress: "15 Science Park Drive, #02-01, Singapore 118227",
    premisePostcode: "118227",
    premiseCity: "West District",
    premiseType: "Industrial/Research Park",
    premiseFloorLevel: "Level 2",
    entertainmentCategory: "F&B Venue with Background Music",
    entertainmentCapacity: 80,
    entertainmentCapacityUnit: "persons",
    entertainmentDurationMonths: 6,
    entertainmentOperatingHours: "08:00 - 22:00 (Daily)",
    documents: [
      {
        id: "DOC-004",
        name: "Identity Card Copy",
        category: "Identity Verification",
        status: "Verified",
        aiConfidence: 94,
        fileName: "nric_tan_kah_kee.jpg",
        fileSize: "950 KB",
        uploadedDate: "2026-06-17",
        contentPreview: "REPUBLIC OF SINGAPORE IDENTITY CARD\nIdentity No: S7890123B\nName: TAN KAH KEE\nRace: CHINESE\nDate of Birth: 21-09-1978\nSex: M\nCountry of Birth: SINGAPORE\nAddress: BLK 456 JURONG WEST STREET 41, #12-456, SINGAPORE 640456",
      },
      {
        id: "DOC-005",
        name: "Business Registration (ACRA)",
        category: "Corporate Registration",
        status: "Flagged",
        aiConfidence: 45,
        fileName: "acra_kee_food_ventures.pdf",
        fileSize: "1.8 MB",
        uploadedDate: "2026-06-17",
        contentPreview: "ACRA BUSINESS PROFILE\nRegistration No: 201854321K\nEntity Name: KEE FOOD VENTURES PTE. LTD.\nIncorporation Date: 10/10/2018\nRegistered Address: 8 ROBINSON ROAD, #15-02 ASO BUILDING, SINGAPORE 048544\nPrincipal Activities: FOOD AND BEVERAGE RETAIL\nStatus: Expired / Struck Off as of 10/10/2024",
      },
      {
        id: "DOC-006",
        name: "Tenancy Agreement",
        category: "Premise Right of Use",
        status: "Low Confidence",
        aiConfidence: 55,
        fileName: "tenancy_agreement_science_park.pdf",
        fileSize: "3.5 MB",
        uploadedDate: "2026-06-17",
        contentPreview: "PREMISE LEASE AGREEMENT\nLANDLORD: ASCENDAS LAND SINGAPORE PTE LTD\nTENANT: KEE FOOD SERVICES PTE LTD\nPREMISE: 15 SCIENCE PARK DRIVE, #02-01, SINGAPORE 118227\nTERM: 2 Years commencing 01/01/2024\nRENT: S$6,500",
      }
    ],
    aiFindings: [
      {
        id: "FND-002",
        severity: "High",
        category: "Discrepancy",
        title: "Expired Corporate Registration",
        description: "The ACRA business profile uploaded lists the entity status as 'Expired / Struck Off' as of October 10, 2024. Active registration is mandatory to hold this license.",
        field: "Business Registration Expiry Date",
        suggestedAction: "Request applicant to upload a current and active ACRA business profile."
      },
      {
        id: "FND-003",
        severity: "High",
        category: "Discrepancy",
        title: "Tenancy Tenant Name Mismatch",
        description: "The Tenancy Agreement lists the tenant as 'Kee Food Services Pte Ltd' but the application is under 'Kee Food Ventures Pte. Ltd.'. These are legally distinct entities.",
        field: "Business Legal Name",
        suggestedAction: "Request clarification regarding corporate name alignment across submission and lease."
      },
      {
        id: "FND-004",
        severity: "Medium",
        category: "Zoning",
        title: "Zoning Restriction Pre-Alert",
        description: "The premise address at Science Park Drive is in an industrial zoning area. While food outlets are permitted as ancillary services, entertainment facilities face tight restrictions.",
        field: "Premise Address",
        suggestedAction: "Validate with urban zoning registry if entertainment operations are allowed at this address."
      }
    ],
    auditLogs: [
      {
        id: "LOG-003",
        action: "Application Submitted",
        user: "Applicant (Tan Kah Kee)",
        timestamp: "2026-06-17 11:22:45"
      },
      {
        id: "LOG-004",
        action: "AI Processing Completed",
        user: "System AI Agent",
        timestamp: "2026-06-17 11:24:12",
        notes: "Multiple critical issues identified. Confidence score: 38%. Set flag to Flagged and marked isUrgent = true."
      }
    ]
  }
};

// Generates a fallback application detail if not pre-defined
export const getApplicationDetails = (app: Application): ApplicationDetail => {
  const existing = mockApplicationDetails[app.id];
  if (existing) {
    return {
      ...existing,
      // sync general status if changed in UI
      status: app.status,
    };
  }

  // Fallback generation based on general details
  return {
    ...app,
    icNumber: "S8008888X",
    email: `${app.applicantName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: "+65 9876 5432",
    dob: "1985-08-08",
    address: "Blk 888 Ang Mo Kio Avenue 8, #08-888, Singapore 560888",
    businessName: `${app.applicantName} F&B Enterprises`,
    businessRegNumber: "201999999Z",
    businessPosition: "Director",
    businessPhone: "+65 6888 8888",
    businessRegDate: "2019-09-09",
    businessExpiryDate: "2028-09-09",
    businessAddress: "88 Marina Boulevard, #88-08 Marina Bay Financial Centre, Singapore 018981",
    premiseAddress: "88 Orchard Road, #08-88, Singapore 238888",
    premisePostcode: "238888",
    premiseCity: "Central District",
    premiseType: "Shopping Mall",
    premiseFloorLevel: "Level 8",
    entertainmentCategory: app.licenseType,
    entertainmentCapacity: 100,
    entertainmentCapacityUnit: "persons",
    entertainmentDurationMonths: 12,
    entertainmentOperatingHours: "10:00 - 22:00 (Daily)",
    documents: [
      {
        id: `DOC-GEN-1-${app.id}`,
        name: "Identity Card Copy",
        category: "Identity Verification",
        status: "Verified",
        aiConfidence: 95,
        fileName: "nric_applicant.pdf",
        fileSize: "1.1 MB",
        uploadedDate: app.submissionDate,
        contentPreview: `REPUBLIC OF SINGAPORE IDENTITY CARD\nIdentity No: S8008888X\nName: ${app.applicantName.toUpperCase()}\nDate of Birth: 08-08-1985\nSex: M\nCountry of Birth: SINGAPORE\nAddress: BLK 888 ANG MO KIO AVENUE 8, #08-888, SINGAPORE 560888`,
      },
      {
        id: `DOC-GEN-2-${app.id}`,
        name: "Business Registration (ACRA)",
        category: "Corporate Registration",
        status: app.status === "Flagged" ? "Low Confidence" : "Verified",
        aiConfidence: app.aiConfidence,
        fileName: "acra_registration.pdf",
        fileSize: "2.1 MB",
        uploadedDate: app.submissionDate,
        contentPreview: `ACRA BUSINESS PROFILE\nRegistration No: 201999999Z\nEntity Name: ${app.applicantName.toUpperCase()} F&B ENTERPRISES\nIncorporation Date: 09/09/2019\nStatus: Live`,
      }
    ],
    aiFindings: app.status === "Flagged" ? [
      {
        id: `FND-GEN-1-${app.id}`,
        severity: "High",
        category: "Discrepancy",
        title: "Generic Verification Alert",
        description: "The AI agent detected potential alignment discrepancies on the business name. Verify files against database records.",
        field: "Business Legal Name",
        suggestedAction: "Audit file contents carefully."
      }
    ] : [
      {
        id: `FND-GEN-2-${app.id}`,
        severity: "Low",
        category: "Verification",
        title: "Perfect Alignment",
        description: "All uploaded files align perfectly with applicant details and business registration databases.",
        field: "All fields",
        suggestedAction: "Proceed to final decisioning."
      }
    ],
    auditLogs: [
      {
        id: `LOG-GEN-1-${app.id}`,
        action: "Application Submitted",
        user: `Applicant (${app.applicantName})`,
        timestamp: `${app.submissionDate} 10:00:00`
      },
      {
        id: `LOG-GEN-2-${app.id}`,
        action: "AI Analysis Performed",
        user: "System AI Agent",
        timestamp: `${app.submissionDate} 10:01:15`,
        notes: `AI Confidence at ${app.aiConfidence}%. Status: ${app.status}`
      }
    ]
  };
};
