import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UploadDocumentType } from './dto/upload-document.dto';
import { DocumentType } from '../../generated/prisma/client';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async uploadDocument(
    applicationVersionId: string,
    documentType: UploadDocumentType,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // 1. Validate file (size, type)
    this.validateFile(documentType, file);

    // 2. Verify ApplicationVersion exists and load Application details
    const version = await this.prisma.applicationVersion.findUnique({
      where: { id: applicationVersionId },
      include: { application: true },
    });

    if (!version) {
      throw new NotFoundException(`Application version with ID "${applicationVersionId}" not found`);
    }

    const applicationId = version.applicationId;
    const versionNumber = version.versionNumber;

    // 3. Generate storage path and file extension
    const extension = file.originalname.split('.').pop() || '';
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const storagePath = `applications/${applicationId}/${versionNumber}/${documentType}_${Date.now()}_${cleanFileName}`;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'application-documents';

    // 4. Upload to Supabase Storage
    await this.supabaseService.uploadFile(bucket, storagePath, file.buffer, file.mimetype);

    // 5. Use database transaction to:
    //    a) Set any existing 'uploaded' document of the same type for this version to 'replaced'
    //    b) Create the new document record
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.applicationDocument.updateMany({
        where: {
          applicationVersionId,
          documentType: documentType as unknown as DocumentType,
          uploadStatus: 'uploaded',
        },
        data: {
          uploadStatus: 'replaced',
        },
      });

      return await tx.applicationDocument.create({
        data: {
          applicationVersionId,
          documentType: documentType as unknown as DocumentType,
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          storagePath: storagePath,
          uploadStatus: 'uploaded',
        },
      });
    });

    return result;
  }

  private validateFile(documentType: UploadDocumentType, file: Express.Multer.File) {
    // Max file size: 10MB
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new BadRequestException(
        `File size exceeds the limit of 10MB (file size: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`,
      );
    }

    const mimeType = file.mimetype;
    const extension = file.originalname.split('.').pop()?.toLowerCase() || '';
    
    const isImageExt = ['png', 'jpg', 'jpeg', 'webp'].includes(extension);
    const isPdfExt = extension === 'pdf';

    const isImage = mimeType.startsWith('image/') || isImageExt;
    const isPdf = mimeType === 'application/pdf' || isPdfExt;

    switch (documentType) {
      case UploadDocumentType.PASSPORT_PHOTO:
        if (!isImage) {
          throw new BadRequestException('Passport photo must be an image (JPEG, PNG, WEBP)');
        }
        break;

      case UploadDocumentType.IDENTITY_CARD:
        if (!isImage && !isPdf) {
          throw new BadRequestException('Identity card copy must be an image or a PDF');
        }
        break;

      case UploadDocumentType.SSM:
        if (!isImage && !isPdf) {
          throw new BadRequestException('Business registration copy (SSM) must be an image or a PDF');
        }
        break;

      case UploadDocumentType.TENANCY_AGREEMENT:
        if (!isImage && !isPdf) {
          throw new BadRequestException('Tenancy agreement must be an image or a PDF');
        }
        break;

      default:
        throw new BadRequestException(`Unsupported document type: ${documentType}`);
    }
  }

  async getDocumentMetadata(id: string) {
    const doc = await this.prisma.applicationDocument.findUnique({
      where: { id },
    });
    if (!doc || doc.uploadStatus === 'removed') {
      throw new NotFoundException(`Document with ID "${id}" not found`);
    }
    return doc;
  }

  async getDocumentDownloadUrl(id: string) {
    const doc = await this.getDocumentMetadata(id);
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'application-documents';
    
    const data = await this.supabaseService.createSingleSignedUrl(bucket, doc.storagePath);
    const signedUrl = data?.signedUrl;
    if (!signedUrl) {
      throw new NotFoundException(`Could not generate signed download URL for document ID "${id}"`);
    }
    return signedUrl;
  }

  async listDocumentsByVersion(versionId: string) {
    return await this.prisma.applicationDocument.findMany({
      where: {
        applicationVersionId: versionId,
        uploadStatus: 'uploaded',
      },
    });
  }

  async deleteDocument(id: string) {
    const doc = await this.getDocumentMetadata(id);
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'application-documents';

    // 1. Delete file from Supabase storage
    await this.supabaseService.deleteFile(bucket, doc.storagePath);

    // 2. Mark as removed in the database
    return await this.prisma.applicationDocument.update({
      where: { id },
      data: {
        uploadStatus: 'removed',
      },
    });
  }
}
