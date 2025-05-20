import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../../config/cloudinary.config';

export const CloudinaryFileInterceptor = FileInterceptor('file', {
  storage,
});
