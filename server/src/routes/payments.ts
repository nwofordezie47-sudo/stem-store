import { Router } from 'express';
import {
  initializePayment,
  verifyPayment,
  handleWebhook,
} from '../controllers/paymentController';
import asyncHandler from '../middleware/asyncHandler';
import protect from '../middleware/auth';
import csrfCheck from '../middleware/csrfCheck';

const router = Router();

// Webhook — no CSRF check (it's a server-to-server POST from Paystack, not a browser).
// Protected by HMAC-SHA512 signature verification inside the controller.
// raw body parsing is applied in index.ts BEFORE express.json().
router.post('/webhook', asyncHandler(handleWebhook));

// User-facing payment routes
router.post('/initialize', protect, csrfCheck, asyncHandler(initializePayment));
router.get('/verify/:reference', protect, asyncHandler(verifyPayment));

export default router;
