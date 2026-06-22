import { Router } from 'express';
import {
  getAdminStats,
  getAdminSales,
  getAdminUsers,
} from '../controllers/adminController';
import protect from '../middleware/auth';
import adminOnly from '../middleware/adminOnly';
import asyncHandler from '../middleware/asyncHandler';

const router = Router();

// Apply auth protection to all administrative routes
router.use(protect);
router.use(adminOnly);

// Administrative read-only GET routes (no csrfCheck required)
router.get('/stats', asyncHandler(getAdminStats));
router.get('/sales', asyncHandler(getAdminSales));
router.get('/users', asyncHandler(getAdminUsers));

export default router;
