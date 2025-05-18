// src/config/cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'submissions',
    resource_type: 'auto',
  }),
});

export default cloudinary;
