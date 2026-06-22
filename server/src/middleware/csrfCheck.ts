import { Request, Response, NextFunction } from 'express';

/**
 * CSRF protection for state-changing routes (POST / PUT / DELETE).
 *
 * Required because sameSite: 'none' cookies provide no implicit CSRF protection
 * (unlike 'strict' or 'lax'). An explicit Origin check fills that gap.
 *
 * DO NOT apply this to POST /api/payments/webhook — that route receives
 * legitimate cross-origin requests from Paystack's servers, and is already
 * protected by HMAC-SHA512 signature verification.
 */
const csrfCheck = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const origin = req.headers.origin;
  const allowed = [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
  ].filter(Boolean);

  if (!origin || !allowed.includes(origin)) {
    res.status(403).json({ error: 'Forbidden: invalid origin' });
    return;
  }

  next();
};

export default csrfCheck;
