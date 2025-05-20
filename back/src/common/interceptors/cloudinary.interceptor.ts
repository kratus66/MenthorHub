// src/common/interceptors/cloudinary.interceptor.ts
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../../config/cloudinary.config';

export function CloudinaryFileInterceptor(fieldName: string) {
  return FileInterceptor(fieldName, { storage });
}