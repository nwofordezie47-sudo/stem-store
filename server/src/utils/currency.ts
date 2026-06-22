/**
 * Currency conversion utilities.
 *
 * Rule: DB and Paystack always deal in kobo. The frontend always sees naira.
 * Convert at the boundary — never store naira, never send kobo to the client.
 */

/** Convert naira to kobo for storage / Paystack calls. */
export const toKobo = (naira: number): number => Math.round(naira * 100);

/** Convert kobo from DB / Paystack to naira for API responses. */
export const toNaira = (kobo: number): number => kobo / 100;
