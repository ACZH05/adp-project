import {
  Controller,
  Post,
  Get,
  Delete,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { Response } from 'express';

@ApiTags('documents')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a verification document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadDocumentDto })
  @ApiCreatedResponse({ description: 'Document uploaded and metadata saved successfully.' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Omit<UploadDocumentDto, 'file'>,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const { applicationVersionId, documentType } = body;
    if (!applicationVersionId) {
      throw new BadRequestException('applicationVersionId is required');
    }
    if (!documentType) {
      throw new BadRequestException('documentType is required');
    }

    return await this.documentService.uploadDocument(
      applicationVersionId,
      documentType,
      file,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document metadata by ID' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiOkResponse({ description: 'Document metadata returned successfully.' })
  async getMetadata(@Param('id') id: string) {
    return await this.documentService.getDocumentMetadata(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download document file (redirects to signed Supabase URL)' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const signedUrl = await this.documentService.getDocumentDownloadUrl(id);
    return res.redirect(signedUrl);
  }

  @Get('version/:versionId')
  @ApiOperation({ summary: 'List all active documents for a given application version ID' })
  @ApiParam({ name: 'versionId', description: 'Application Version ID' })
  @ApiOkResponse({ description: 'List of documents returned successfully.' })
  async listByVersion(@Param('versionId') versionId: string) {
    return await this.documentService.listDocumentsByVersion(versionId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document file and mark record as removed' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiOkResponse({ description: 'Document deleted successfully.' })
  async deleteFileRecord(@Param('id') id: string) {
    return await this.documentService.deleteDocument(id);
  }
}
