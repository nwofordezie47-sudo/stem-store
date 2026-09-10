import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import Purchase from '../models/Purchase';
import Stem from '../models/Stem';

const paystackAPI = axios.create({
  baseURL: 'https://api.paystack.co',
});

paystackAPI.interceptors.request.use((config) => {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (key) {
    config.headers.Authorization = `Bearer ${key}`;
  }
  config.headers['Content-Type'] = 'application/json';
  return config;
});

// ─── Initialize ──────────────────────────────────────────────────────────────

export const initializePayment = async (req: Request, res: Response): Promise<void> => {
  const { stemId } = req.body as { stemId?: string };

  if (!stemId) {
    res.status(400).json({ error: 'stemId is required' });
    return;
  }

  const stem = await Stem.findOne({ _id: stemId, isActive: true });
  if (!stem) {
    res.status(404).json({ error: 'Stem not found' });
    return;
  }

  const user = req.user!;
  // Unique, traceable reference: readable prefix + IDs + timestamp
  const reference = `STEM_${stemId}_${user._id}_${Date.now()}`;

  // Sandbox bypass for testing checkout flow locally
  if (process.env.PAYSTACK_SECRET_KEY === 'sk_test_dummy') {
    await Purchase.create({
      user: user._id,
      stem: stem._id,
      amount: stem.price,
      paystackRef: reference,
      status: 'pending',
    });

    res.json({
      authorization_url: `${(process.env.CLIENT_URL || 'http://localhost:3001').replace(/\/+$/, '')}/mock-checkout?reference=${reference}&amount=${stem.price}&title=${encodeURIComponent(stem.title)}`,
      reference,
    });
    return;
  }

  const key = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!key) {
    res.status(500).json({ error: 'PAYSTACK_SECRET_KEY is not configured in server environment variables.' });
    return;
  }

  // Create a pending Purchase now so we have a DB record before the user leaves
  await Purchase.create({
    user: user._id,
    stem: stem._id,
    amount: stem.price, // already in kobo
    paystackRef: reference,
    status: 'pending',
  });

  // Call Paystack — amount must be in kobo
  const callback_url = `${req.protocol}://${req.get('host')}/api/payments/callback`;

  try {
    const { data } = await paystackAPI.post('/transaction/initialize', {
      email: user.email,
      amount: stem.price, // kobo
      reference,
      callback_url,
      metadata: {
        stemId: String(stem._id),
        userId: String(user._id),
        stemTitle: stem.title,
      },
    });

    res.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (paystackErr: any) {
    const detail =
      paystackErr.response?.data?.message ||
      paystackErr.response?.data?.error ||
      paystackErr.message ||
      'Paystack transaction initialization failed';
    console.error('Paystack initialization error:', detail, paystackErr.response?.data);
    res.status(paystackErr.response?.status || 500).json({
      error: `Paystack: ${detail}`,
    });
  }
};

// ─── Verify (UI feedback) ────────────────────────────────────────────────────

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  const { reference } = req.params;

  if (process.env.PAYSTACK_SECRET_KEY === 'sk_test_dummy') {
    await Purchase.findOneAndUpdate(
      { paystackRef: reference },
      { status: 'success' },
      { new: true }
    );
    res.json({ status: 'success', message: 'Payment verified (mock)' });
    return;
  }

  try {
    const { data } = await paystackAPI.get(`/transaction/verify/${reference}`);
    const transaction = data.data;

    if (transaction.status === 'success') {
      await Purchase.findOneAndUpdate(
        { paystackRef: reference },
        { status: 'success' },
        { new: true }
      );
      res.json({ status: 'success', message: 'Payment verified' });
    } else {
      await Purchase.findOneAndUpdate(
        { paystackRef: reference },
        { status: 'failed' }
      );
      res.status(402).json({ status: transaction.status, message: 'Payment not successful' });
    }
  } catch (verifyErr: any) {
    const detail =
      verifyErr.response?.data?.message ||
      verifyErr.response?.data?.error ||
      verifyErr.message ||
      'Paystack verification failed';
    res.status(verifyErr.response?.status || 500).json({ error: `Paystack: ${detail}` });
  }
};

// ─── Webhook (source of truth) ───────────────────────────────────────────────

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  // req.body is a raw Buffer here (express.raw() applied in index.ts)
  const signature = req.headers['x-paystack-signature'] as string | undefined;
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  const hash = crypto
    .createHmac('sha512', secret)
    .update(req.body as Buffer)
    .digest('hex');

  if (!signature || hash !== signature) {
    // Reject unsigned or tampered requests without revealing why
    res.status(401).json({ error: 'Invalid signature' });
    return;
  }

  // Parse after verification so we know the payload is authentic
  const event = JSON.parse((req.body as Buffer).toString()) as {
    event: string;
    data: {
      reference: string;
      status: string;
      amount: number;
      customer: { email: string };
      metadata?: { stemId: string; userId: string };
    };
  };

  // Only handle charge success — ignore other event types
  if (event.event !== 'charge.success') {
    res.sendStatus(200);
    return;
  }

  const { reference, status } = event.data;

  if (status === 'success') {
    // findOneAndUpdate is idempotent — if webhook fires twice for the same
    // reference, the unique index on paystackRef prevents double Purchase creation.
    await Purchase.findOneAndUpdate(
      { paystackRef: reference },
      { status: 'success' },
      { new: true }
    );
  }

  // Always respond 200 — Paystack retries on non-2xx responses
  res.sendStatus(200);
};

export const handleCallback = async (req: Request, res: Response): Promise<void> => {
  const reference = req.query.reference as string | undefined;

  if (!reference) {
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3001'}/my-purchases?error=no_reference`);
    return;
  }

  try {
    const { data } = await paystackAPI.get(`/transaction/verify/${reference}`);
    const transaction = data.data;

    if (transaction.status === 'success') {
      await Purchase.findOneAndUpdate(
        { paystackRef: reference },
        { status: 'success' },
        { new: true }
      );
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3001'}/my-purchases?success=true`);
    } else {
      await Purchase.findOneAndUpdate(
        { paystackRef: reference },
        { status: 'failed' }
      );
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3001'}/my-purchases?error=payment_failed`);
    }
  } catch (error) {
    console.error('Error verifying callback:', error);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3001'}/my-purchases?error=verification_failed`);
  }
};
