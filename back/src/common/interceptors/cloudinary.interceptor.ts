import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'mentorhub',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'png', 'mp4', 'pdf'],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

// 🎯 Para un solo archivo
export function CloudinaryFileInterceptor(fieldName: string) {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    private interceptor;

    constructor() {
      const InterceptorClass = FileInterceptor(fieldName, {
        storage: cloudinaryStorage,
      });
      this.interceptor = new InterceptorClass();
    }

    intercept(context: ExecutionContext, next: CallHandler) {
      return this.interceptor.intercept(context, next);
    }
  }

  return mixin(MixinInterceptor);
}

// 🎯 Para múltiples archivos
export function CloudinaryMultipleFilesInterceptor(fieldName: string, maxCount = 10) {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    private interceptor;

    constructor() {
      const InterceptorClass = FilesInterceptor(fieldName, maxCount, {
        storage: cloudinaryStorage,
      });
      this.interceptor = new InterceptorClass();
    }

    intercept(context: ExecutionContext, next: CallHandler) {
      return this.interceptor.intercept(context, next);
    }
  }

  return mixin(MixinInterceptor);
}
