
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as dotenv from 'dotenv';
import { Request } from 'express';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dbje9gzug',  // Valor predeterminado si no se encuentra la variable de entorno
  api_key: process.env.CLOUDINARY_API_KEY || '974511327978699',  // Valor predeterminado si no se encuentra la variable de entorno
  api_secret: process.env.CLOUDINARY_API_SECRET || 'JFNwe3Sd0s3R1dd9rHLIfAfwLIg',  // Valor predeterminado si no se encuentra la variable de entorno
});


export { cloudinary };






