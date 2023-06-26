import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      v2.uploader
        .upload_stream(
          {
            folder: 'chat-app',
            resource_type: 'image',
            use_filename: true,
          },
          (error, result) => {
            if (error) return reject(error);
            return resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async uploadImages(files: Express.Multer.File[]) {
    const uploaded = await Promise.all(files.map(file => this.uploadImage(file)));
    return uploaded.map(file => file.url);
  }

  async deleteImages(...filePath: string[]) {
    await v2.api.delete_resources([...filePath], {
      resource_type: 'image',
    });
  }
}
