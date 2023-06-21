import {
  FileTypeValidator,
  HttpStatus,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

@Injectable()
export class FileUploadPipe extends ParseFilePipe {
  constructor() {
    super({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      validators: [
        new FileTypeValidator({ fileType: 'jpg|png|jpeg' }),
        new MaxFileSizeValidator({
          maxSize: 1024 ** 2,
          message:
            'File too large. You can upload file with maximum size of 1MB',
        }),
      ],
    });
  }
}
