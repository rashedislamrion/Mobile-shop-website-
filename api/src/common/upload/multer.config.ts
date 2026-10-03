import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { storageService } from './storage.service';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
];
const ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg',
  '.pdf',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function getUploadRoot(): string {
  return process.env.UPLOAD_ROOT || join(process.cwd(), 'uploads');
}

export function createMulterConfig(subfolder: string): MulterOptions {
  // Prevent directory traversal: sanitize subfolder to alphanumeric, dash, and underscore
  const safeSubfolder = subfolder.replace(/[^a-zA-Z0-9_-]/g, '');

  return {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const uploadDir = join(getUploadRoot(), safeSubfolder);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        callback(null, uploadDir);
      },
      filename: (req, file, callback) => {
        const fileExt = extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
          return callback(
            new BadRequestException(
              `Disallowed file extension "${fileExt}". Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
            ),
            '',
          );
        }
        const baseName = file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .slice(0, 50); // Prevent excessively long filenames
        const uniqueId = crypto.randomUUID();
        const safeFilename = `${uniqueId}-${baseName}${fileExt}`;
        callback(null, safeFilename);
      },
    }),
    fileFilter: (req, file, callback) => {
      const fileExt = extname(file.originalname).toLowerCase();
      if (
        !ALLOWED_MIME_TYPES.includes(file.mimetype) ||
        !ALLOWED_EXTENSIONS.includes(fileExt)
      ) {
        return callback(
          new BadRequestException(
            `Invalid file: ${file.mimetype} with extension ${fileExt}. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`,
          ),
          false,
        );
      }
      callback(null, true);
    },
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  };
}

/**
 * Resolves an uploaded file to its storage URL (Cloudflare R2 public URL or local disk URL)
 */
export async function resolveUploadedFile(
  file: Express.Multer.File | undefined | null,
  subfolder: string,
): Promise<string | null> {
  if (!file) return null;
  return storageService.uploadFile(file, subfolder);
}

/**
 * Resolves multiple uploaded files to storage URLs
 */
export async function resolveUploadedFiles(
  files: Express.Multer.File[] | undefined | null,
  subfolder: string,
): Promise<string[]> {
  if (!files || files.length === 0) return [];
  return storageService.uploadFiles(files, subfolder);
}
