export const selectUSDC = (data?: WallectDetail) => {
  // if (!data) return { amount: 0 };
  console.log("data", data);
  return data?.circle.data.tokenBalances.find((token) =>
    token.token.symbol === "USDC"
  )!;
};
