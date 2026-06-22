import multer, { StorageEngine } from 'multer';
import { Request } from 'express';
import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CloudinaryFile extends Express.Multer.File {
  cloudinary?: UploadApiResponse;
  resourceType?: string;
}

type DoneCallback = (error: Error | null, file?: Partial<CloudinaryFile>) => void;

// ─── Field configuration ─────────────────────────────────────────────────────

interface FieldConfig {
  folder: string;
  resourceType: 'image' | 'video' | 'raw' | 'auto';
  // 'authenticated' files require a signed URL to download — used for full WAV downloads.
  // 'upload' files are publicly accessible — used for thumbnails and preview clips.
  accessType: 'upload' | 'authenticated';
}

const FIELD_CONFIG: Record<string, FieldConfig> = {
  thumbnail: {
    folder: 'stem-store/thumbnails',
    resourceType: 'image',
    accessType: 'upload',
  },
  preview: {
    // CLOUDINARY NOTE: Audio files (WAV, MP3) must use resource_type:'video'.
    // Using 'image' or 'raw' for audio causes silent upload failures.
    folder: 'stem-store/previews',
    resourceType: 'video',
    accessType: 'upload',
  },
  downloadFile: {
    // Private — requires a signed URL. Stored as 'authenticated' in Cloudinary.
    folder: 'stem-store/downloads',
    resourceType: 'video',
    accessType: 'authenticated',
  },
};

// ─── Custom Multer Storage Engine ─────────────────────────────────────────────

class CloudinaryStorage implements StorageEngine {
  _handleFile(
    _req: Request,
    file: Express.Multer.File,
    cb: DoneCallback
  ): void {
    const config = FIELD_CONFIG[file.fieldname];

    if (!config) {
      return cb(new Error(`Unexpected upload field: "${file.fieldname}"`));
    }

    let resourceType = config.resourceType;
    if (file.fieldname === 'downloadFile') {
      const isArchive = ALLOWED_ARCHIVE_TYPES.includes(file.mimetype);
      resourceType = isArchive ? 'raw' : 'video';
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: config.folder,
        resource_type: resourceType,
        type: config.accessType,
      },
      (error, result) => {
        if (error || !result) {
          return cb(error ?? new Error('Cloudinary upload failed'));
        }

        // Attach Cloudinary result fields to the multer file object
        cb(null, {
          path: result.secure_url,     // publicly accessible URL
          filename: result.public_id,  // Cloudinary public_id — used for signed URL generation
          size: result.bytes,
          cloudinary: result,
          resourceType: result.resource_type,
        });
      }
    );

    file.stream.pipe(uploadStream);
  }

  _removeFile(
    _req: Request,
    file: CloudinaryFile,
    cb: (error: Error | null) => void
  ): void {
    if (!file.filename) return cb(null);

    const config = FIELD_CONFIG[file.fieldname];
    const resourceType = file.resourceType || config?.resourceType || 'image';

    cloudinary.uploader
      .destroy(file.filename, { resource_type: resourceType })
      .then(() => cb(null))
      .catch(cb);
  }
}

// ─── MIME validation ──────────────────────────────────────────────────────────

const ALLOWED_AUDIO_TYPES = ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_ARCHIVE_TYPES = ['application/zip', 'application/x-zip-compressed', 'application/x-zip'];

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const isAudio = ALLOWED_AUDIO_TYPES.includes(file.mimetype);
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
  const isArchive = ALLOWED_ARCHIVE_TYPES.includes(file.mimetype);

  if (file.fieldname === 'thumbnail' && isImage) return cb(null, true);
  if (file.fieldname === 'preview' && isAudio) return cb(null, true);
  if (file.fieldname === 'downloadFile' && (isAudio || isArchive)) return cb(null, true);

  cb(new Error(`Invalid file type "${file.mimetype}" for field "${file.fieldname}"`));
};

// ─── Multer instance ─────────────────────────────────────────────────────────

const upload = multer({
  storage: new CloudinaryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB cap per file
  },
  fileFilter,
});

/**
 * Multer field config for the stem upload route.
 * All three files are required — the controller validates their presence.
 */
export const uploadStemFiles = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'preview', maxCount: 1 },
  { name: 'downloadFile', maxCount: 1 },
]);

/** Single image upload for thumbnail-only updates */
export const uploadThumbnail = upload.single('thumbnail');

