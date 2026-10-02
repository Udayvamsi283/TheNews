import multer from 'multer';
import { Request } from 'express';

// Store files in memory so they can be streamed directly to Cloudinary
const storage = multer.memoryStorage();

// Allowed MIME types across categories
const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  // Audio
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  // Video
  'video/mp4',
  'video/webm',
  // Documents / CSV
  'application/pdf',
  'text/csv',
  'text/plain',
  'application/vnd.ms-excel'
];

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed types include standard images, audio, mp4, and CSV/PDF.`));
  }
};

// 10MB maximum file size limit aligned with Cloudinary Free Plan and production safety
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter
});
