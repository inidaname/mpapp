import Realm from 'realm';
import { TransactionSchema } from './transaction';

const db = new Realm({ schema: [TransactionSchema], schemaVersion: 1 });

export const saveTransaction = (tx: any) => {
  db.write(() => db.create('Transaction', tx, Realm.UpdateMode.Modified));
};

export const getPendingTransactions = () => {
  return db.objects('Transaction').filtered('status != "settled"');
};
