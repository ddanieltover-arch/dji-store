export function checkoutIdempotencyKey(customerId: string, cartFingerprint: string): string {
  return `chk_${customerId}_${cartFingerprint}`;
}

export type CheckoutAttemptResult = 'committed' | 'duplicate_replay' | 'retry_safe';

export function resolveCheckoutAttempt(existingPaymentIntent: string | null, incomingKey: string, storedKey: string): CheckoutAttemptResult {
  if (existingPaymentIntent && incomingKey === storedKey) {
    return 'duplicate_replay';
  }
  if (incomingKey !== storedKey) {
    return 'retry_safe';
  }
  return 'committed';
}
