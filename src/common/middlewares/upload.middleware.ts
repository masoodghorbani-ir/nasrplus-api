import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { ApiError } from '../utils/api-error';

const tempDir = path.join(process.cwd(), 'uploads', 'temp');

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
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
