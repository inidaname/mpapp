import { useCallback, useState } from "react";
import { useGetUserProfileQuery } from "../service/endpoints/user-endpoints";
import { useGetWalletByIdQuery } from "../service/endpoints/wallets-endpoints";
import { useAppSelector } from "../store/redux";

export function useRefreshUserAndWallet(refetchTransactions?: () => void) {
  const [refreshing, setRefreshing] = useState(false);
  const { active_wallet } = useAppSelector((state) => state.wallet);

  const { refetch: refetchUser } = useGetUserProfileQuery();
  const { refetch: refetchWallet } = useGetWalletByIdQuery(
    active_wallet?.id ?? "",
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      const tasks: any[] = [
        refetchUser(),
        refetchWallet(),
      ];

      if (refetchTransactions) {
        tasks.push(refetchTransactions());
      }

      await Promise.all(tasks);
    } finally {
      setRefreshing(false);
    }
  }, [refetchTransactions, refetchUser, refetchWallet]);

  return { refreshing, onRefresh };
}
