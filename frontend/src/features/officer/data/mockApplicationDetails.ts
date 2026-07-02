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
    icNumber: "900412-01-5678",
    email: "sarah.lim@gmail.com",
    phone: "+60 12-345 6789",
    dob: "1990-04-12",
    address: "No. 15, Jalan Kemboja 3, Taman Kemboja, 81000 Kulai, Johor, Malaysia",
    businessName: "Lim & Tan Entertainment Group Sdn. Bhd.",
    businessRegNumber: "202001012345",
    businessPosition: "Managing Director",
    businessPhone: "+60 7-663 1234",
    businessRegDate: "2020-05-15",
    businessExpiryDate: "2027-05-15",
    businessAddress: "No. 8A, Jalan Kulai-Kota Tinggi, Taman Perindustrian Kulai, 81000 Kulai, Johor, Malaysia",
    premiseAddress: "Lot 123, Jalan IOI 4, Bandar Putra, 81000 Kulai, Johor, Malaysia",
    premisePostcode: "81000",
    premiseCity: "Kulai",
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
        fileName: "ic_sarah_lim.pdf",
        fileSize: "1.2 MB",
        uploadedDate: "2026-06-17",
        contentPreview: "KERAJAAN MALAYSIA KAD PENGENALAN\nNo. Kad Pengenalan: 900412-01-5678\nNama: SARAH LIM MIN\nRace: CINA\nTarikh Lahir: 12-04-1990\nSex: P\nNegeri Lahir: JOHOR\nAlamat: NO. 15, JALAN KEMBOJA 3, TAMAN KEMBOJA, 81000 KULAI, JOHOR",
      },
      {
        id: "DOC-002",
        name: "Business Registration (SSM)",
        category: "Corporate Registration",
        status: "Verified",
        aiConfidence: 96,
        fileName: "ssm_lim_tan_entertainment.pdf",
        fileSize: "2.4 MB",
        uploadedDate: "2026-06-17",
        contentPreview: "SSM CORPORATE PROFILE\nRegistration No: 202001012345 (1357924-X)\nEntity Name: LIM & TAN ENTERTAINMENT GROUP SDN. BHD.\nIncorporation Date: 15/05/2020\nRegistered Address: NO. 8A, JALAN KULAI-KOTA TINGGI, TAMAN PERINDUSTRIAN KULAI, 81000 KULAI, JOHOR\nPrincipal Activities: BARS, PUBS AND CABARETS\nDirectors: SARAH LIM MIN (appointed 15/05/2020)",
      },
      {
        id: "DOC-003",
        name: "Tenancy Agreement",
        category: "Premise Right of Use",
        status: "Verified",
        aiConfidence: 89,
        fileName: "tenancy_agreement_ioi_mall.pdf",
        fileSize: "4.8 MB",
        uploadedDate: "2026-06-17",
        contentPreview: "TENANCY AGREEMENT\nLANDLORD: IOI MALL KULAI SDN. BHD.\nTENANT: LIM & TAN ENTERTAINMENT GROUP SDN. BHD.\nPREMISE: LOT 123, JALAN IOI 4, BANDAR PUTRA, 81000 KULAI, JOHOR\nTERM: 3 Years commencing 01/01/2025 and expiring 31/12/2027\nMONTHLY RENT: RM12,000",
      }
    ],
    aiFindings: [
      {
        id: "FND-001",
        severity: "Low",
        category: "Discrepancy",
        title: "Slight Name Variation",
        description: "Applicant name on IC is 'Sarah Lim Min' but submission name is 'Sarah Lim'. Verified match via SSM records and matching ID number.",
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
    icNumber: "780921-01-9012",
    email: "kahkee.tan@foodventures.my",
    phone: "+60 19-776 5432",
    dob: "1978-09-21",
    address: "No. 42, Jalan Susur Kulai 2, Taman Kulai Besar, 81000 Kulai, Johor, Malaysia",
    businessName: "Kee Food Ventures Sdn. Bhd.",
    businessRegNumber: "201801054321",
    businessPosition: "Owner",
    businessPhone: "+60 7-663 5678",
    businessRegDate: "2018-10-10",
    businessExpiryDate: "2024-10-10", // Expired!
    businessAddress: "No. 102, Jalan Merbau, Taman Kulai Utama, 81000 Kulai, Johor, Malaysia",
    premiseAddress: "Lot 45, Jalan SME 1, Kawasan Perindustrian SME, 81000 Kulai, Johor, Malaysia",
    premisePostcode: "81000",
    premiseCity: "Kulai",
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
        fileName: "ic_tan_kah_kee.jpg",
        fileSize: "950 KB",
        uploadedDate: "2026-06-17",
        contentPreview: "KERAJAAN MALAYSIA KAD PENGENALAN\nNo. Kad Pengenalan: 780921-01-9012\nNama: TAN KAH KEE\nRace: CINA\nTarikh Lahir: 21-09-1978\nSex: M\nNegeri Lahir: JOHOR\nAlamat: NO. 42, JALAN SUSUR KULAI 2, TAMAN KULAI BESAR, 81000 KULAI, JOHOR",
      },
      {
        id: "DOC-005",
        name: "Business Registration (SSM)",
        category: "Corporate Registration",
        status: "Flagged",
        aiConfidence: 45,
        fileName: "ssm_kee_food_ventures.pdf",
        fileSize: "1.8 MB",
        uploadedDate: "2026-06-17",
        contentPreview: "SSM CORPORATE PROFILE\nRegistration No: 201801054321 (1284567-V)\nEntity Name: KEE FOOD VENTURES SDN. BHD.\nIncorporation Date: 10/10/2018\nRegistered Address: NO. 102, JALAN MERBAU, TAMAN KULAI UTAMA, 81000 KULAI, JOHOR\nPrincipal Activities: FOOD AND BEVERAGE RETAIL\nStatus: Expired / Struck Off as of 10/10/2024",
      },
      {
        id: "DOC-006",
        name: "Tenancy Agreement",
        category: "Premise Right of Use",
        status: "Low Confidence",
        aiConfidence: 55,
        fileName: "tenancy_agreement_industrial_park.pdf",
        fileSize: "3.5 MB",
        uploadedDate: "2026-06-17",
        contentPreview: "PREMISE LEASE AGREEMENT\nLANDLORD: KULAI INDUSTRIAL PARK SDN BHD\nTENANT: KEE FOOD SERVICES SDN BHD\nPREMISE: LOT 45, JALAN SME 1, KAWASAN PERINDUSTRIAN SME, 81000 KULAI, JOHOR\nTERM: 2 Years commencing 01/01/2024\nRENT: RM6,500",
      }
    ],
    aiFindings: [
      {
        id: "FND-002",
        severity: "High",
        category: "Discrepancy",
        title: "Expired Corporate Registration",
        description: "The SSM business profile uploaded lists the entity status as 'Expired / Struck Off' as of October 10, 2024. Active registration is mandatory to hold this license.",
        field: "Business Registration Expiry Date",
        suggestedAction: "Request applicant to upload a current and active SSM business profile."
      },
      {
        id: "FND-003",
        severity: "High",
        category: "Discrepancy",
        title: "Tenancy Tenant Name Mismatch",
        description: "The Tenancy Agreement lists the tenant as 'Kee Food Services Sdn Bhd' but the application is under 'Kee Food Ventures Sdn. Bhd.'. These are legally distinct entities.",
        field: "Business Legal Name",
        suggestedAction: "Request clarification regarding corporate name alignment across submission and lease."
      },
      {
        id: "FND-004",
        severity: "Medium",
        category: "Zoning",
        title: "Zoning Restriction Pre-Alert",
        description: "The premise address at Kawasan Perindustrian SME is in an industrial zoning area. While food outlets are permitted as ancillary services, entertainment facilities face tight restrictions.",
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
    icNumber: "850808-01-4321",
    email: `${app.applicantName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: "+60 13-987 6543",
    dob: "1985-08-08",
    address: "No. 88, Jalan Bersatu 5, Taman Bersatu, 81000 Kulai, Johor, Malaysia",
    businessName: `${app.applicantName} F&B Sdn. Bhd.`,
    businessRegNumber: "201901099999",
    businessPosition: "Director",
    businessPhone: "+60 7-663 8888",
    businessRegDate: "2019-09-09",
    businessExpiryDate: "2028-09-09",
    businessAddress: "No. 99, Jalan Senai Utama, Taman Senai Utama, 81400 Senai, Kulai, Johor, Malaysia",
    premiseAddress: "Lot 88, Jalan Putra 1, Bandar Putra, 81000 Kulai, Johor, Malaysia",
    premisePostcode: "81000",
    premiseCity: "Kulai",
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
        fileName: "ic_applicant.pdf",
        fileSize: "1.1 MB",
        uploadedDate: app.submissionDate,
        contentPreview: `KERAJAAN MALAYSIA KAD PENGENALAN\nNo. Kad Pengenalan: 850808-01-4321\nNama: ${app.applicantName.toUpperCase()}\nDate of Birth: 08-08-1985\nSex: M\nCountry of Birth: MALAYSIA\nAddress: NO. 88, JALAN BERSATU 5, TAMAN BERSATU, 81000 KULAI, JOHOR`,
      },
      {
        id: `DOC-GEN-2-${app.id}`,
        name: "Business Registration (SSM)",
        category: "Corporate Registration",
        status: app.status === "Flagged" ? "Low Confidence" : "Verified",
        aiConfidence: app.aiConfidence,
        fileName: "ssm_registration.pdf",
        fileSize: "2.1 MB",
        uploadedDate: app.submissionDate,
        contentPreview: `SSM CORPORATE PROFILE\nRegistration No: 201901099999\nEntity Name: ${app.applicantName.toUpperCase()} F&B SDN. BHD.\nIncorporation Date: 09/09/2019\nStatus: Active`,
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
