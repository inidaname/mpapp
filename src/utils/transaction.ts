export const TransactionSchema = {
  name: 'Transaction',
  primaryKey: 'tx_id',
  properties: {
    tx_id: 'string',
    from: 'string',
    to_session: 'string',
    amount: 'int',
    currency: 'string',
    nonce: 'int',
    timestamp: 'int',
    expiry: 'int',
    signature: 'string',
    receipt: 'string?',
    status: 'string', // pending_sent, pending_received, settled, rejected
    createdAt: 'int',
  },
};

export const SessionSchema = {
  name: 'Session',
  primaryKey: 'sessionId',
  properties: {
    sessionId: 'string',
    pubkey: 'string',
    deviceId: 'string?',
    createdAt: 'int',
    ttl: 'int',
    amountRequested: 'int?',
  },
};
