import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as dotenv from 'dotenv';
import { Request } from 'express';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || 'dczl1jubf',
  api_key: process.env.CLOUDINARY_API_KEY || '839741711765487',
  api_secret: process.env.CLOUDINARY_API_SECRET || '0lE1mwsY_S3SLLYQDBbpoj1XFqo',
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File): Promise<Record<string, string | string[]>> => ({
    folder: 'mentorhub',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'mp4', 'mov', 'avi', 'webm'],
  }),
});

export { cloudinary };


