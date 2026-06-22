import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController';
import asyncHandler from '../middleware/asyncHandler';
import protect from '../middleware/auth';
import csrfCheck from '../middleware/csrfCheck';

const router = Router();

// All favorites routes require authentication
router.use(protect);

router.get('/', asyncHandler(getFavorites));
router.post('/:stemId', csrfCheck, asyncHandler(addFavorite));
router.delete('/:stemId', csrfCheck, asyncHandler(removeFavorite));

export default router;
