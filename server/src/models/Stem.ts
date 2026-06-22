import mongoose, { Schema, Document } from 'mongoose';

export interface IStem extends Document {
  title: string;
  producer: string;
  price: number; 
  category: string;
  thumbnailUrl: string;
  previewUrl: string;
  downloadUrl: string;       
  downloadPublicId: string;  
  isFeatured: boolean;
  tags: string[];
  isActive: boolean;         
  downloadResourceType: 'video' | 'raw';
  createdAt: Date;
  updatedAt: Date;
}

const StemSchema = new Schema<IStem>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    producer: {
      type: String,
      required: [true, 'Producer name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail is required'],
    },
    previewUrl: {
      type: String,
      required: [true, 'Preview audio is required'],
    },
      downloadUrl: {
      type: String,
      required: [true, 'Download file is required'],
      select: false,
    },
    downloadPublicId: {
      type: String,
      required: [true, 'Download public ID is required'],
      select: false,
    },
    downloadResourceType: {
      type: String,
      enum: ['video', 'raw'],
      default: 'video',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String, trim: true }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

StemSchema.index({ title: 'text', producer: 'text', tags: 'text' });

StemSchema.index({ category: 1, isActive: 1 });
StemSchema.index({ isActive: 1, createdAt: -1 });
StemSchema.index({ isActive: 1, price: 1 });

export default mongoose.model<IStem>('Stem', StemSchema);
