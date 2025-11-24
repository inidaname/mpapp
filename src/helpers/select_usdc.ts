export const selectUSDC = (data?: WallectDetail) => {
  return data?.circle.data.tokenBalances.find((token) =>
    token.token.symbol === "USDC"
  )!;
};
