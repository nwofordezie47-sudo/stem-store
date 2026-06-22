import { Router } from 'express';
import { signup, login, logout, getMe } from '../controllers/authController';
import asyncHandler from '../middleware/asyncHandler';
import protect from '../middleware/auth';
import csrfCheck from '../middleware/csrfCheck';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply tight rate limit to all auth routes
router.use(authLimiter);

router.post('/signup', csrfCheck, asyncHandler(signup));
router.post('/login', csrfCheck, asyncHandler(login));
router.post('/logout', csrfCheck, asyncHandler(logout));
router.get('/me', protect, asyncHandler(getMe));

export default router;
