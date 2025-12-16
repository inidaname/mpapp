interface OfflineTransactions {
  address?: string | null;
  name?: string | null;
  signature?: string | null;
  amount?: number | null;
  synced?: boolean;
  status?: 'completed' | 'aborted';
  reference: string | null;
  createdAt?: string | null;
  syncedAt?: string | null;
  type?: 'credit' | 'debit';
}

interface UpdateTransaction {
  status: 'completed' | 'aborted';
  reference: string;
  synced?: boolean;
}
