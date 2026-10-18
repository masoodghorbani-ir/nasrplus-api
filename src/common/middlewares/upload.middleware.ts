import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { ApiError } from '../utils/api-error';

const tempDir = path.join(process.cwd(), 'uploads', 'temp');
const memberPhotosDir = path.join(process.cwd(), 'uploads', 'members', 'photos');
const memberCertificatesDir = path.join(process.cwd(), 'uploads', 'members', 'certificates');

// Ensure upload directories exist
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
if (!fs.existsSync(memberPhotosDir)) {
  fs.mkdirSync(memberPhotosDir, { recursive: true });
}
if (!fs.existsSync(memberCertificatesDir)) {
  fs.mkdirSync(memberCertificatesDir, { recursive: true });
}

// Multer disk storage for temporary Excel files
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tempDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const fileId = randomUUID();
    cb(null, `${fileId}${ext}`);
  },
});

// Excel file upload configuration
export const excelUpload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB file size limit
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(ApiError.badRequest('Invalid file format. Only .xlsx, .xls, and .csv files are supported'));
    }
  },
});

// Multer disk storage for member profile photos
const photoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, memberPhotosDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const memberId = (req.params?.id as string) || 'member';
    const uniqueSuffix = `${Date.now()}-${randomUUID().slice(0, 8)}`;
    cb(null, `${memberId}-${uniqueSuffix}${ext}`);
  },
});

// Member photo upload configuration (Images up to 5MB)
export const memberPhotoUpload = multer({
  storage: photoStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max photo size
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(ApiError.badRequest('Invalid image format. Only JPEG, PNG, and WebP images are allowed'));
    }
  },
});

// Multer disk storage for member skill certificates
const certificateStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, memberCertificatesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const memberId = (req.params?.id as string) || 'member';
    const uniqueSuffix = `${Date.now()}-${randomUUID().slice(0, 8)}`;
    cb(null, `cert-${memberId}-${uniqueSuffix}${ext}`);
  },
});

// Member certificate upload configuration (PDF and Images up to 10MB)
export const memberCertificateUpload = multer({
  storage: certificateStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max certificate size
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

    if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(ApiError.badRequest('Invalid file format. Only PDF and images (JPEG, PNG, WebP) are allowed for certificates'));
    }
  },
});

