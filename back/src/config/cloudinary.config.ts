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


export { cloudinary };


