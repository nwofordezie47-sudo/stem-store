import { Request, Response } from 'express';
import Purchase from '../models/Purchase';
import Stem from '../models/Stem';
import User from '../models/User';
import { toNaira } from '../utils/currency';

/** Get general administrative statistics */
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  // Aggregate sum of successful purchase amounts (stored in kobo)
  const revenueAggregation = await Purchase.aggregate([
    { $match: { status: 'success' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const totalRevenueKobo = revenueAggregation[0]?.total || 0;
  const totalRevenue = toNaira(totalRevenueKobo);

  // Count active stems
  const totalStems = await Stem.countDocuments({ isActive: true });

  // Count total registered non-admin users
  const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });

  res.json({
    totalRevenue,
    totalStems,
    totalUsers,
  });
};

/** Get paginated log of successful sales */
export const getAdminSales = async (req: Request, res: Response): Promise<void> => {
  const { page = '1', limit = '10' } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [sales, total] = await Promise.all([
    Purchase.find({ status: 'success' })
      .populate('user', 'fullName email')
      .populate('stem', 'title producer price category thumbnailUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Purchase.countDocuments({ status: 'success' }),
  ]);

  res.json({
    sales: sales.map((sale) => {
      const user = sale.user as any;
      const stem = sale.stem as any;
      return {
        id: sale._id,
        amount: toNaira(sale.amount),
        currency: sale.currency,
        paystackRef: sale.paystackRef,
        createdAt: sale.createdAt,
        user: user ? {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        } : null,
        stem: stem ? {
          id: stem._id,
          title: stem.title,
          producer: stem.producer,
          price: toNaira(stem.price),
          category: stem.category,
          thumbnailUrl: stem.thumbnailUrl,
        } : null,
      };
    }),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};

/** Get paginated list of registered users */
export const getAdminUsers = async (req: Request, res: Response): Promise<void> => {
  const { page = '1', limit = '10' } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find({ role: { $ne: "admin" } })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    User.countDocuments({ role: { $ne: "admin" } }),
  ]);

  res.json({
    users,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};
