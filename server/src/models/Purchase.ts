import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchase extends Document {
  user: mongoose.Types.ObjectId;
  stem: mongoose.Types.ObjectId;
  amount: number; // in kobo — price captured at the moment of purchase
  currency: string;
  paystackRef: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stem: {
      type: Schema.Types.ObjectId,
      ref: 'Stem',
      required: true,
    },
    // Kobo — captured at purchase time so price changes don't affect history
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    // unique: true is the idempotency guard.
    // Both /verify and /webhook can fire for the same transaction —
    // the duplicate upsert is safely rejected by this index.
    paystackRef: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);
