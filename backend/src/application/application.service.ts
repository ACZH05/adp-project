import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationService } from '../verification/verification.service';
import { SubmitApplicationDto } from './dto/submit-application.dto';
import {
  ApplicationStatus,
  PremiseType,
  FloorLevel,
  EntertainmentType,
  ApplicationVersionStatus,
  VerificationJobStatus,
  DocumentType,
} from '../../generated/prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly verificationService: VerificationService,
  ) {}

  private mapPremiseType(type: string): PremiseType {
    if (!type) return PremiseType.other;
    const t = type.toLowerCase();
    if (t.includes('mall')) return PremiseType.mall;
    if (t.includes('hotel')) return PremiseType.hotel;
    if (t.includes('resort')) return PremiseType.resort;
    if (t.includes('hall')) return PremiseType.hall;
    if (t.includes('corner')) return PremiseType.corner_shop;
    if (t.includes('middle')) return PremiseType.middle_shop;
    if (t.includes('shop') || t.includes('commercial')) return PremiseType.corner_shop;
    if (t.includes('warehouse') || t.includes('industrial')) return PremiseType.warehouse;
    return PremiseType.other;
  }

  private mapFloorLevel(level: string): FloorLevel {
    if (!level) return FloorLevel.other;
    const l = level.toLowerCase();
    if (l.includes('ground')) return FloorLevel.ground;
    if (l.includes('mezzanine')) return FloorLevel.mezzanine;
    if (l.includes('parking')) return FloorLevel.parking;
    if (l.includes('upper') || l.includes('first') || l.includes('level') || l.includes('floor')) return FloorLevel.upper;
    return FloorLevel.other;
  }

  private mapEntertainmentType(type: string): EntertainmentType {
    if (!type) return EntertainmentType.live_band;
    const e = type.toLowerCase();
    if (e.includes('live music') || e.includes('band')) return EntertainmentType.live_band;
    if (e.includes('dj') || e.includes('dance') || e.includes('club')) return EntertainmentType.dance;
    if (e.includes('karaoke')) return EntertainmentType.karaoke;
    if (e.includes('arcade') || e.includes('gaming')) return EntertainmentType.amusement;
    if (e.includes('theater') || e.includes('cinema')) return EntertainmentType.cinema;
    if (e.includes('exhibition') || e.includes('show')) return EntertainmentType.amusement;
    return EntertainmentType.live_band;
  }

  private cleanNumber(val: any): number {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  private cleanTimeHour(val: any): number {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const parsed = parseInt(val.split(':')[0], 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  async upsertApplication(dto: SubmitApplicationDto, status: 'draft' | 'submitted') {
    // 1. Find or create the applicant user
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase(),
          fullName: dto.fullName,
          passwordHash: 'dummy-hash',
          role: 'applicant',
          accountStatus: 'active',
        },
      });
    }

    let applicationId = dto.applicationId;
    let applicationVersionId = dto.applicationVersionId;
    let appNo = '';

    // 2. Load or create Application
    let application;
    if (applicationId) {
      application = await this.prisma.application.findUnique({
        where: { id: applicationId },
      });
      if (!application) {
        throw new NotFoundException(`Application with ID "${applicationId}" not found`);
      }
      appNo = application.applicationNo;
    }

    const applicationData = {
      applicantUserId: user.id,
      status: status === 'submitted' ? ApplicationStatus.verification_queued : ApplicationStatus.draft,
      applicantFullName: dto.fullName,
      applicantIcNo: dto.icPassport,
      businessName: dto.businessName,
      businessRegistrationNo: dto.regNumber,
      premiseAddress: dto.premiseAddress,
      premiseType: this.mapPremiseType(dto.premiseType),
      floorLevel: this.mapFloorLevel(dto.floorLevel),
      entertainmentType: this.mapEntertainmentType(dto.primaryType),
    };

    if (!application) {
      // Create new application
      appNo = `APP-${Date.now()}`;
      application = await this.prisma.application.create({
        data: {
          ...applicationData,
          applicationNo: appNo,
        },
      });
      applicationId = application.id;
    } else {
      // Update existing application
      application = await this.prisma.application.update({
        where: { id: applicationId },
        data: applicationData,
      });
    }

    // 3. Load or create ApplicationVersion
    let version;
    const formSnapshotJson = JSON.parse(JSON.stringify(dto)) as any;

    const versionData = {
      applicationId: applicationId!,
      formSnapshot: formSnapshotJson,
      versionStatus: status === 'submitted' ? ApplicationVersionStatus.submitted : ApplicationVersionStatus.draft,
      submittedAt: status === 'submitted' ? new Date() : null,
    };

    const latestVersion = await this.prisma.applicationVersion.findFirst({
      where: { applicationId: applicationId! },
      orderBy: { versionNumber: 'desc' },
      include: { documents: true },
    });

    if (
      applicationVersionId &&
      latestVersion &&
      latestVersion.id === applicationVersionId &&
      latestVersion.versionStatus === ApplicationVersionStatus.draft
    ) {
      version = await this.prisma.applicationVersion.update({
        where: { id: applicationVersionId },
        data: versionData,
      });
    } else {
      const nextVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;
      version = await this.prisma.applicationVersion.create({
        data: {
          ...versionData,
          versionNumber: nextVersionNumber,
          previousVersionId: latestVersion?.id || null,
        },
      });
      applicationVersionId = version.id;

      // Copy documents from previous version if any exist and haven't been re-uploaded
      if (latestVersion && latestVersion.documents.length > 0) {
        for (const doc of latestVersion.documents) {
          const existingInNewVersion = await this.prisma.applicationDocument.findFirst({
            where: {
              applicationVersionId: version.id,
              documentType: doc.documentType,
            },
          });
          if (!existingInNewVersion) {
            await this.prisma.applicationDocument.create({
              data: {
                applicationVersionId: version.id,
                documentType: doc.documentType,
                fileName: doc.fileName,
                fileSize: doc.fileSize,
                fileType: doc.fileType,
                storagePath: doc.storagePath,
                uploadStatus: doc.uploadStatus,
              },
            });
          }
        }
      }
    }

    // Update Application's current version links
    await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        currentApplicationVersionId: applicationVersionId,
        currentVersionNumber: version.versionNumber,
      },
    });

    // 4. If submitted, trigger AI verification enqueuing
    if (status === 'submitted') {
      // Fetch uploaded documents for this version
      const dbDocs = await this.prisma.applicationDocument.findMany({
        where: {
          applicationVersionId: applicationVersionId!,
          uploadStatus: 'uploaded',
        },
      });

      const verificationJobId = randomUUID();

      // Format form_data for AI engine schema (e.g. numbers as numbers, Dates as Dates)
      const cleanFormData = {
        fullName: dto.fullName,
        icPassport: dto.icPassport,
        dob: dto.dob,
        email: dto.email,
        contactNumber: dto.contactNumber,
        residentialAddress: dto.residentialAddress,
        businessName: dto.businessName,
        position: dto.position,
        businessPhone: dto.businessPhone,
        regDate: dto.regDate ? (new Date(dto.regDate).toISOString().split('T')[0] as any) : null,
        expiryDate: dto.expiryDate ? (new Date(dto.expiryDate).toISOString().split('T')[0] as any) : null,
        regNumber: dto.regNumber,
        businessAddress: dto.businessAddress,
        premiseAddress: dto.premiseAddress,
        postcode: this.cleanNumber(dto.postcode),
        cityDistrict: dto.cityDistrict,
        premiseType: dto.premiseType as any,
        floorLevel: dto.floorLevel,
        primaryType: dto.primaryType as any,
        quantityCapacity: this.cleanNumber(dto.quantityCapacity),
        quantityUnit: dto.quantityUnit as any,
        requestedDuration: this.cleanNumber(dto.requestedDuration),
        operatingHoursStart: this.cleanTimeHour(dto.operatingHoursStart),
        operatingHoursEnd: this.cleanTimeHour(dto.operatingHoursEnd),
        signatoryName: dto.signatoryName,
        signatoryIc: dto.signatoryIc,
        companyName: dto.companyName,
        acceptedDeclaration: !!dto.acceptedDeclaration,
      };

      const documentRefs = dbDocs.map((d) => ({
        application_document_id: d.id,
        document_type: d.documentType as any,
        storage_path: d.storagePath,
        file_name: d.fileName,
        file_type: d.fileType,
      }));

      // Add verification job in BullMQ
      const job = await this.verificationService.enqueueVerificationJob({
        verification_job_id: verificationJobId,
        application_id: applicationId!,
        application_version_id: applicationVersionId!,
        applicant_user_id: user.id,
        form_data: cleanFormData,
        document_refs: documentRefs,
      });

      // Create VerificationJob entry in database
      await this.prisma.verificationJob.create({
        data: {
          id: verificationJobId,
          applicationVersionId: applicationVersionId!,
          bullmqJobId: job.id!,
          jobStatus: VerificationJobStatus.queued,
        },
      });
    }

    return {
      applicationId,
      applicationVersionId,
      applicationNo: appNo,
      status: status === 'submitted' ? 'submitted' : 'draft',
    };
  }

  async getApplicationsByUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      return [];
    }

    const applications = await this.prisma.application.findMany({
      where: { applicantUserId: user.id },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 1,
          include: {
            documents: {
              where: { uploadStatus: 'uploaded' },
            },
            verificationJobs: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                verificationReport: {
                  include: {
                    verificationIssues: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return applications.map((app) => {
      const latestVersion = app.versions[0];
      const formSnapshot = (latestVersion?.formSnapshot as any) || {};

      // Retrieve latest verification job issues if they exist
      const latestJob = latestVersion?.verificationJobs?.[0];
      const report = latestJob?.verificationReport;
      const issues = report?.verificationIssues || [];

      // Calculate confidence score dynamically or return null if pending
      const aiConfidence = report?.confidenceScore !== undefined && report?.confidenceScore !== null
        ? Math.round(report.confidenceScore)
        : null;

      return {
        id: app.id,
        applicationNo: app.applicationNo,
        status: app.status, // draft, submitted, etc.
        licenseType: formSnapshot.primaryType || 'Food Establishment License',
        submissionDate: app.updatedAt,
        aiConfidence,
        documents: {
          approved: latestVersion?.documents?.length || 0,
          total: 4,
        },
        docList: (latestVersion?.documents || []).map((doc) => {
          // Check if there is any issue associated with this document
          const docIssue = issues.find((issue) => issue.applicationDocumentId === doc.id);
          
          let aiStatus = 'verified';
          if (app.status === 'verification_in_progress') {
            aiStatus = 'verifying';
          } else if (docIssue) {
            aiStatus = 'flagged';
          }

          return {
            id: doc.id,
            documentType: doc.documentType,
            fileName: doc.fileName,
            fileSize: doc.fileSize,
            aiStatus,
            aiMessage: docIssue ? docIssue.message : null,
          };
        }),
        formSnapshot,
        applicationVersionId: latestVersion?.id,
        aiFindings: issues.map((issue) => ({
          id: issue.id,
          title: issue.fieldName ? `Field Mismatch: ${issue.fieldName}` : `Document Check: ${issue.documentType || 'General'}`,
          category: issue.issueType === 'missing_document' ? 'Document Quality' : 'Discrepancy',
          severity: issue.issueSeverity === 'high' ? 'High' : issue.issueSeverity === 'medium' ? 'Medium' : 'Low',
          description: issue.message,
          field: issue.fieldName || 'N/A',
          suggestedAction: issue.recommendedCorrection || 'Please verify the details and upload documents.',
        })),
      };
    });
  }
}
