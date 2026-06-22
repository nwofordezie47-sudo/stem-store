import { Router } from 'express';
import {
  getAllStems,
  getStemById,
  createStem,
  updateStem,
  deleteStem,
} from '../controllers/stemController';
import asyncHandler from '../middleware/asyncHandler';
import protect from '../middleware/auth';
import adminOnly from '../middleware/adminOnly';
import csrfCheck from '../middleware/csrfCheck';
import { uploadStemFiles } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', asyncHandler(getAllStems));
router.get('/:id', asyncHandler(getStemById));

// Admin-only routes — protect → adminOnly → csrfCheck → upload → controller
router.post(
  '/',
  protect,
  adminOnly,
  csrfCheck,
  uploadStemFiles,
  asyncHandler(createStem)
);

router.put(
  '/:id',
  protect,
  adminOnly,
  csrfCheck,
  uploadStemFiles,
  asyncHandler(updateStem)
);

router.delete('/:id', protect, adminOnly, csrfCheck, asyncHandler(deleteStem));

export default router;
