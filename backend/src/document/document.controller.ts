import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

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
}
