interface Web3IconData {
  id: string;
  name: string;
  type: string;
  symbol: string;
  variants: [
    "branded",
    "mono",
    "background",
  ];
  urls: {
    branded: string;
    mono: string;
    background: string;
  };
  metadata: {
    id: string;
    fileName: string;
    symbol: string;
    name: string;
    marketCapRank: number;
    addresses: {};
    variants: [
      "branded",
      "mono",
      "background",
    ];
  };
}
