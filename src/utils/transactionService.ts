import { ensureKeypair, signMessage, verifySignature } from './encrypt';
import { saveTransaction } from './storageService';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';

export async function createTransaction(to: string, amount: number) {
  const kp = await ensureKeypair();
  const tx = {
    tx_id: uuidv4(),
    from: kp.pk,
    to,
    amount,
    currency: 'NGN',
    nonce: Date.now(),
    timestamp: Math.floor(Date.now() / 1000),
    expiry: Math.floor(Date.now() / 1000) + 60 * 30,
    signature: '',
    status: 'pending_sent',
    createdAt: Date.now(),
  };
  tx.signature = signMessage(
    Uint8Array.from(Buffer.from(JSON.stringify(tx))),
    kp.sk,
  );
  saveTransaction(tx);
  return tx;
}

export async function verifyIncomingTransaction(tx: any) {
  const payload = Uint8Array.from(
    Buffer.from(JSON.stringify({ ...tx, signature: undefined })),
  );
  return verifySignature(payload, tx.signature, tx.from);
}
