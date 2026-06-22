import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Purchase from '../models/Purchase';
import Stem from '../models/Stem';
import cloudinary from '../config/cloudinary';
import { toNaira } from '../utils/currency';

// ─── My Purchases ────────────────────────────────────────────────────────────

export const getMyPurchases = async (req: Request, res: Response): Promise<void> => {
  const purchases = await Purchase.find({
    user: req.user!._id,
    status: 'success',
  })
    .populate('stem', 'title producer thumbnailUrl category price')
    .sort({ createdAt: -1 });

  res.json({
    purchases: purchases.map((p) => {
      const stem = p.stem as unknown as InstanceType<typeof Stem> | null;
      return {
        id: p._id,
        amount: toNaira(p.amount),
        currency: p.currency,
        paystackRef: p.paystackRef,
        createdAt: p.createdAt,
        stem: stem
          ? {
              id: stem._id,
              title: stem.title,
              producer: stem.producer,
              thumbnailUrl: stem.thumbnailUrl,
              category: stem.category,
              price: toNaira(stem.price),
            }
          : null,
      };
    }),
  });
};

// ─── Download ────────────────────────────────────────────────────────────────

export const downloadStem = async (req: Request, res: Response): Promise<void> => {
  const { stemId } = req.params;

  if (!mongoose.isValidObjectId(stemId)) {
    res.status(400).json({ error: 'Invalid stem ID' });
    return;
  }

  // Step 1: Verify the user has a successful purchase for this stem
  const purchase = await Purchase.findOne({
    user: req.user!._id,
    stem: stemId,
    status: 'success',
  });

  if (!purchase) {
    res.status(403).json({ error: 'Purchase required to download this stem' });
    return;
  }

  // Step 2: Fetch the stem with download fields — the ONLY place in the app
  // that uses .select('+downloadUrl +downloadPublicId')
  const stem = await Stem.findById(stemId).select('+downloadUrl +downloadPublicId +downloadResourceType');

  if (!stem) {
    res.status(404).json({ error: 'Stem not found' });
    return;
  }

  // Step 3: Generate a signed, expiring Cloudinary URL (60 seconds)
  // The file is stored as type:'authenticated' so it requires a signed URL.
  const signedUrl = cloudinary.url(stem.downloadPublicId, {
    resource_type: stem.downloadResourceType || 'video',  // dynamic resource type (video or raw)
    type: 'authenticated',
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 60, // 60 second window
    flags: 'attachment',  // forces browser to download rather than play inline
  });

  res.json({ url: signedUrl });
};
