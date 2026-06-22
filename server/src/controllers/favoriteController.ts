import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Stem from '../models/Stem';
import { toNaira } from '../utils/currency';


export const getFavorites = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user!._id).populate(
    'favorites',
    'title producer thumbnailUrl previewUrl category price'
  );

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const favorites = (user.favorites as unknown as InstanceType<typeof Stem>[]).map((stem) => ({
    id: stem._id,
    title: stem.title,
    producer: stem.producer,
    thumbnailUrl: stem.thumbnailUrl,
    previewUrl: stem.previewUrl,
    category: stem.category,
    price: toNaira(stem.price),
  }));

  res.json({ favorites });
};



export const addFavorite = async (req: Request, res: Response): Promise<void> => {
  const { stemId } = req.params;

  if (!mongoose.isValidObjectId(stemId)) {
    res.status(400).json({ error: 'Invalid stem ID' });
    return;
  }

  const stemExists = await Stem.exists({ _id: stemId, isActive: true });
  if (!stemExists) {
    res.status(404).json({ error: 'Stem not found' });
    return;
  }

  await User.findByIdAndUpdate(req.user!._id, {
    $addToSet: { favorites: new mongoose.Types.ObjectId(stemId) },
  });

  res.json({ message: 'Added to favorites' });
};


export const removeFavorite = async (req: Request, res: Response): Promise<void> => {
  const { stemId } = req.params;

  if (!mongoose.isValidObjectId(stemId)) {
    res.status(400).json({ error: 'Invalid stem ID' });
    return;
  }

  await User.findByIdAndUpdate(req.user!._id, {
    $pull: { favorites: new mongoose.Types.ObjectId(stemId) },
  });

  res.json({ message: 'Removed from favorites' });
};
