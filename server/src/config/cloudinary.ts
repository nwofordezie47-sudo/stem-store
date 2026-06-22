import { v2 as cloudinary } from 'cloudinary';

// IMPORTANT: Cloudinary treats audio files (WAV, MP3) under resource_type: "video".
// Never use resource_type: "image" for audio — the upload will silently fail or
// be processed incorrectly. See: https://cloudinary.com/documentation/audio_transformations

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
