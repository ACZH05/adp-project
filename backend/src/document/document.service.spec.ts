import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UploadDocumentType } from './dto/upload-document.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('../../generated/prisma/client', () => {
  return {
    PrismaClient: class {},
    DocumentType: {
      applicant_passport_photo: 'applicant_passport_photo',
      identity_card_copy: 'identity_card_copy',
      business_registration_copy: 'business_registration_copy',
      tenancy_agreement: 'tenancy_agreement',
    },
  };
});

jest.mock('../../supabase/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn().mockResolvedValue({ data: {}, error: null }),
      createSignedUrls: jest.fn().mockResolvedValue({ data: [], error: null }),
    },
  },
}));

describe('DocumentService', () => {
  let service: DocumentService;
  let prismaService: any;
  let supabaseService: any;

  beforeEach(async () => {
    const mockPrismaService = {
      applicationVersion: {
        findUnique: jest.fn(),
      },
      applicationDocument: {
        updateMany: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(mockPrismaService)),
    };

    const mockSupabaseService = {
      uploadFile: jest.fn().mockResolvedValue({ path: 'uploaded-path' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    prismaService = module.get<PrismaService>(PrismaService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadDocument', () => {
    const mockFile = {
      originalname: 'passport.jpg',
      mimetype: 'image/jpeg',
      size: 500 * 1024, // 500 KB
      buffer: Buffer.from('mock-file-content'),
    } as Express.Multer.File;

    it('should throw BadRequestException if file is missing', async () => {
      await expect(
        service.uploadDocument('version-id', UploadDocumentType.PASSPORT_PHOTO, null as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if file size exceeds limit', async () => {
      const hugeFile = { ...mockFile, size: 11 * 1024 * 1024 } as Express.Multer.File;
      await expect(
        service.uploadDocument('version-id', UploadDocumentType.PASSPORT_PHOTO, hugeFile),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if passport photo is not an image', async () => {
      const pdfFile = { ...mockFile, mimetype: 'application/pdf', originalname: 'doc.pdf' } as Express.Multer.File;
      await expect(
        service.uploadDocument('version-id', UploadDocumentType.PASSPORT_PHOTO, pdfFile),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if application version does not exist', async () => {
      prismaService.applicationVersion.findUnique.mockResolvedValue(null);
      await expect(
        service.uploadDocument('non-existent-id', UploadDocumentType.PASSPORT_PHOTO, mockFile),
      ).rejects.toThrow(NotFoundException);
    });

    it('should upload file and save document metadata to database', async () => {
      const mockVersion = {
        id: 'version-id',
        applicationId: 'app-id',
        versionNumber: 1,
        application: {
          id: 'app-id',
          applicantUserId: 'user-id',
        },
      };

      prismaService.applicationVersion.findUnique.mockResolvedValue(mockVersion);
      prismaService.applicationDocument.create.mockResolvedValue({
        id: 'doc-id',
        applicationVersionId: 'version-id',
        documentType: 'applicant_passport_photo',
        uploadStatus: 'uploaded',
      });

      const result = await service.uploadDocument(
        'version-id',
        UploadDocumentType.PASSPORT_PHOTO,
        mockFile,
      );

      expect(supabaseService.uploadFile).toHaveBeenCalled();
      expect(prismaService.applicationDocument.updateMany).toHaveBeenCalledWith({
        where: {
          applicationVersionId: 'version-id',
          documentType: 'applicant_passport_photo',
          uploadStatus: 'uploaded',
        },
        data: {
          uploadStatus: 'replaced',
        },
      });
      expect(prismaService.applicationDocument.create).toHaveBeenCalled();
      expect(result.id).toBe('doc-id');
    });
  });
});
