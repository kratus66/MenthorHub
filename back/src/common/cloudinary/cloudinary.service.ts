import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    fileBuffer: Buffer,
    options: UploadApiOptions = {},
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload result is undefined'));
        return resolve(result);
      });

      Readable.from(fileBuffer).pipe(uploadStream);
    });
  }
}
