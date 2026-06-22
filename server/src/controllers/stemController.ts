import { Request, Response } from 'express';
import { z } from 'zod';
import Stem from '../models/Stem';
import { toNaira, toKobo } from '../utils/currency';

// ─── Type helpers ────────────────────────────────────────────────────────────

interface UploadedFiles {
  thumbnail?: Express.Multer.File[];
  preview?: Express.Multer.File[];
  downloadFile?: Express.Multer.File[];
}

// Cloudinary attaches extra fields to the Multer file object
interface CloudinaryFile extends Express.Multer.File {
  path: string;       // Cloudinary secure URL
  filename: string;   // Cloudinary public_id
  resourceType?: string;
}

// ─── Schemas ────────────────────────────────────────────────────────────────

const createStemSchema = z.object({
  title: z.string().min(1).trim(),
  producer: z.string().min(1).trim(),
  price: z.coerce.number().positive('Price must be a positive number'),  // receives naira from client
  category: z.string().min(1).trim(),
  tags: z.string().optional(),       // comma-separated string from form-data
  isFeatured: z.coerce.boolean().optional(),
});

const updateStemSchema = createStemSchema.partial();

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Serialize a Stem doc for a public API response (price converted to naira) */
const serializeStem = (stem: InstanceType<typeof Stem>) => ({
  id: stem._id,
  title: stem.title,
  producer: stem.producer,
  price: toNaira(stem.price),
  category: stem.category,
  thumbnailUrl: stem.thumbnailUrl,
  previewUrl: stem.previewUrl,
  isFeatured: stem.isFeatured,
  tags: stem.tags,
  createdAt: stem.createdAt,
});

// ─── Controllers ────────────────────────────────────────────────────────────

export const getAllStems = async (req: Request, res: Response): Promise<void> => {
  const {
    search,
    category,
    sort = 'newest',
    page = '1',
    limit = '20',
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  // Build filter
  const filter: Record<string, unknown> = { isActive: true };

  if (search) {
    filter.$text = { $search: search };
  }

  if (category && category !== 'All') {
    filter.category = category;
  }

  // Sort mapping
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };
  const sortObj = sortMap[sort] ?? sortMap['newest'];

  const [stems, total] = await Promise.all([
    Stem.find(filter).sort(sortObj).skip(skip).limit(limitNum),
    Stem.countDocuments(filter),
  ]);

  res.json({
    stems: stems.map(serializeStem),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};

export const getStemById = async (req: Request, res: Response): Promise<void> => {
  const stem = await Stem.findOne({ _id: req.params.id, isActive: true });

  if (!stem) {
    res.status(404).json({ error: 'Stem not found' });
    return;
  }

  res.json({ stem: serializeStem(stem) });
};

export const createStem = async (req: Request, res: Response): Promise<void> => {
  const parsed = createStemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const files = req.files as UploadedFiles;
  const thumbnailFile = files?.thumbnail?.[0] as CloudinaryFile | undefined;
  const previewFile = files?.preview?.[0] as CloudinaryFile | undefined;
  const downloadFile = files?.downloadFile?.[0] as CloudinaryFile | undefined;

  if (!thumbnailFile || !previewFile || !downloadFile) {
    res.status(400).json({ error: 'thumbnail, preview, and downloadFile are all required' });
    return;
  }

  const { title, producer, price, category, tags, isFeatured } = parsed.data;

  const priceInKobo = toKobo(price);
  if (!Number.isInteger(priceInKobo) || priceInKobo <= 0) {
    res.status(400).json({ error: 'Price must resolve to a valid integer amount of Kobo' });
    return;
  }

  const stem = await Stem.create({
    title,
    producer,
    price: priceInKobo, // convert naira → kobo before storing
    category,
    tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    isFeatured: isFeatured ?? false,
    thumbnailUrl: thumbnailFile.path,
    previewUrl: previewFile.path,
    downloadUrl: downloadFile.path,
    downloadPublicId: downloadFile.filename,
    downloadResourceType: downloadFile.resourceType || 'video',
  });

  res.status(201).json({ stem: serializeStem(stem) });
};

export const updateStem = async (req: Request, res: Response): Promise<void> => {
  const parsed = updateStemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const updates: Record<string, unknown> = { ...parsed.data };

  // Convert price if provided
  if (typeof updates.price === 'number') {
    const priceInKobo = toKobo(updates.price);
    if (!Number.isInteger(priceInKobo) || priceInKobo <= 0) {
      res.status(400).json({ error: 'Price must resolve to a valid integer amount of Kobo' });
      return;
    }
    updates.price = priceInKobo;
  }

  // Parse tags if provided as comma-separated string
  if (typeof updates.tags === 'string') {
    updates.tags = (updates.tags as string).split(',').map((t) => t.trim()).filter(Boolean);
  }

  const files = req.files as UploadedFiles | undefined;

  if (files?.thumbnail?.[0]) {
    updates.thumbnailUrl = (files.thumbnail[0] as CloudinaryFile).path;
  }
  if (files?.preview?.[0]) {
    updates.previewUrl = (files.preview[0] as CloudinaryFile).path;
  }
  if (files?.downloadFile?.[0]) {
    const dlFile = files.downloadFile[0] as CloudinaryFile;
    updates.downloadUrl = dlFile.path;
    updates.downloadPublicId = dlFile.filename;
    updates.downloadResourceType = dlFile.resourceType || 'video';
  }

  const stem = await Stem.findOneAndUpdate(
    { _id: req.params.id, isActive: true },
    updates,
    { new: true, runValidators: true }
  );

  if (!stem) {
    res.status(404).json({ error: 'Stem not found' });
    return;
  }

  res.json({ stem: serializeStem(stem) });
};

export const deleteStem = async (req: Request, res: Response): Promise<void> => {
  // Soft delete — preserves purchase history and favorites for existing buyers
  const stem = await Stem.findOneAndUpdate(
    { _id: req.params.id, isActive: true },
    { isActive: false },
    { new: true }
  );

  if (!stem) {
    res.status(404).json({ error: 'Stem not found' });
    return;
  }

  res.json({ message: 'Stem removed from catalog' });
};
