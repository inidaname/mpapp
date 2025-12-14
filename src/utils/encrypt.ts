import nacl from 'tweetnacl';
import { encode as b64encode, decode as b64decode } from 'base64-arraybuffer';
import * as Keychain from 'react-native-keychain';

function toArrayBuffer(ab: ArrayBufferLike): ArrayBuffer {
  return ab instanceof ArrayBuffer ? ab : (ab.slice(0) as any);
}

export async function ensureKeypair() {
  const key = await Keychain.getGenericPassword({ service: 'device_keypair' });
  if (key) return JSON.parse(key.password);

  const kp = nacl.sign.keyPair();
  const kpObj = {
    pk: b64encode(toArrayBuffer(kp.publicKey.buffer)),
    sk: b64encode(toArrayBuffer(kp.secretKey.buffer)),
  };
  await Keychain.setGenericPassword('kp', JSON.stringify(kpObj), {
    service: 'device_keypair',
  });
  return kpObj;
}

export function signMessage(message: Uint8Array, skBase64: string) {
  const sk = new Uint8Array(toArrayBuffer(b64decode(skBase64)));
  return b64encode(toArrayBuffer(nacl.sign.detached(message, sk).buffer));
}

export function verifySignature(
  message: Uint8Array,
  sigBase64: string,
  pkBase64: string,
) {
  const pk = new Uint8Array(toArrayBuffer(b64decode(pkBase64)));
  const sig = new Uint8Array(toArrayBuffer(b64decode(sigBase64)));
  return nacl.sign.detached.verify(message, sig, pk);
}
