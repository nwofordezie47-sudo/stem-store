import { Request, Response, NextFunction } from 'express';

/**
 * Restricts access to users with role === 'admin'.
 * Must be used after the `protect` middleware.
 */
const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};

export default adminOnly;
