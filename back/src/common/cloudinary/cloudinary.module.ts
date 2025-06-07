// src/common/cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule], // 👈 Importar ConfigModule
  providers: [
    {
      provide: 'CLOUDINARY',
      useFactory: (configService: ConfigService) => {
        const cloud_name = configService.get<string>('CLOUDINARY_NAME');
        const api_key = configService.get<string>('CLOUDINARY_KEY');
        const api_secret = configService.get<string>('CLOUDINARY_SECRET');

        console.log('🔐 CONFIGURANDO CLOUDINARY:');
        console.log('CLOUD_NAME:', cloud_name);
        console.log('API_KEY:', api_key);
        console.log('API_SECRET:', api_secret ? '✅ PRESENTE' : '❌ FALTA');

        cloudinary.config({
          cloud_name,
          api_key,
          api_secret,
        });

        return cloudinary;
      },
      inject: [ConfigService],
    },
    CloudinaryService,
  ],
  exports: ['CLOUDINARY', CloudinaryService],
})
export class CloudinaryModule {}
