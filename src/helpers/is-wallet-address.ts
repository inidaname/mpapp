export const isWalletAddress = (content: string) => {
  const trimmed = content.trim();

  // Ethereum/EVM (0x + 40 hex characters)
  const ethPattern = /^0x[a-fA-F0-9]{40}$/;

  // Bitcoin (26-35 characters, starts with 1, 3, or bc1)
  const btcPattern = /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/;

  // Solana (32-44 characters, base58)
  const solPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

  // Tron (starts with T, 34 characters)
  const tronPattern = /^T[a-zA-Z0-9]{33}$/;

  return ethPattern.test(trimmed) ||
    btcPattern.test(trimmed) ||
    solPattern.test(trimmed) ||
    tronPattern.test(trimmed);
};
