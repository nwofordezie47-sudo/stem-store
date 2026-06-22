import { Router } from 'express';
import { getMyPurchases, downloadStem } from '../controllers/purchaseController';
import asyncHandler from '../middleware/asyncHandler';
import protect from '../middleware/auth';

const router = Router();

// All purchase routes require authentication
router.use(protect);

router.get('/', asyncHandler(getMyPurchases));
router.get('/:stemId/download', asyncHandler(downloadStem));

export default router;
