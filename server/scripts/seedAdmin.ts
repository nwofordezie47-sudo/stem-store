/**
 * Admin seed script — creates the first admin user.
 *
 * Usage:
 *   npm run seed:admin
 *
 * Reads credentials from .env:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FULL_NAME
 *
 * Safe to run multiple times — exits without changes if the email already exists.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';

const seed = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_FULL_NAME ?? 'StemVault Admin';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin account already exists: ${email}`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ fullName, email, password: hashed, role: 'admin' });

  console.log(`Admin created: ${email}`);
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
