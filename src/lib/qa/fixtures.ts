export const SYNTHETIC_CUSTOMERS = [
  {
    id: 'cust_qa_de_001',
    email: 'qa.pilot+de@djii.eu',
    country: 'DE',
    vatId: null,
    cartFingerprint: 'qa_cart_mini4'
  },
  {
    id: 'cust_qa_fr_b2b_002',
    email: 'finance@qa-aerial.fr',
    country: 'FR',
    vatId: 'FR12345678901',
    cartFingerprint: 'qa_cart_inspire3'
  }
];

export const ISOLATED_ENVIRONMENTS = ['local', 'preview', 'staging-eu', 'prod-eu'] as const;
