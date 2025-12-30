import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, RefreshControl, SectionList, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";

import AppText from "../typo/AppText";
import { useGetTransactionQuery } from "../../service/endpoints/transactions-endpoints";
import { useAppSelector } from "../../store/redux";
import { formatRelativeTime } from "../../helpers/formatRelativeTime";
import { useRefreshUserAndWallet } from "../../hooks/useRefreshProfileAndWallet";

const groupByMonth = (transactions: TransactionsList[]) => {
  const sorted = [ ...transactions ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime(),
  );
  const groups: Record<string, TransactionsList[]> = {};

  sorted.forEach((tx) => {
    const date = new Date(tx.created_at);
    const key = date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!groups[ key ]) groups[ key ] = [];
    groups[ key ].push(tx);
  });

  // Convert to SectionList format
  return Object.keys(groups).map((title) => ({
    title,
    data: groups[ title ],
  }));
};

const RecentActivities: React.FC = () => {
  const [ page, setPage ] = useState(1);
  const loadingMoreRef = useRef(false);
  const { active_wallet_address } = useAppSelector((state) => state.wallet);
  const { data, isLoading, refetch, isFetching } = useGetTransactionQuery({
    page,
  });
  const { refreshing, onRefresh } = useRefreshUserAndWallet(refetch);
  const [ allTransactions, setAllTransactions ] = useState<TransactionsList[]>(
    [],
  );

  const sections = useMemo(
    () => groupByMonth(allTransactions),
    [ allTransactions ],
  );

  useEffect(() => {
    if (!isFetching) {
      loadingMoreRef.current = false;
    }
  }, [ isFetching ]);

  useEffect(() => {
    if (!data?.data?.transactions) return;

    setAllTransactions((prev) => {
      const map = new Map<string, TransactionsList>();

      [ ...(page === 1 ? [] : prev), ...data.data.transactions ].forEach((tx) => {
        map.set(tx.id, tx);
      });

      return Array.from(map.values());
    });
  }, [ data, page ]);

  const renderItem = ({ item }: { item: TransactionsList }) => (
    <View className="flex-row w-full p-4">
      <View className="h-14 w-14 items-center justify-center bg-gray-200 rounded-full relative">
        <MaterialIcons
          className="relative"
          name={item.sender_address !== active_wallet_address
            ? "south-west"
            : "north-east"}
          size={30}
          color={item.sender_address !== active_wallet_address
            ? "#215CE1"
            : "#c22828ff"}
        />
        <Image
          source={require("../../../assets/USDC.png")}
          width={200}
          height={200}
          className="absolute -bottom-2 -right-2 h-8 w-8"
        />
      </View>

      <View className="w-full ml-5 pr-5 flex-1">
        <View className="w-full flex-row justify-between items-center">
          <AppText weight="bold" className="text-xl">
            {item.sender_address !== active_wallet_address
              ? `Received`
              : `Sent`}
          </AppText>
          <AppText className="text-gray-500 text-sm">
            {formatRelativeTime(item.created_at)}
          </AppText>
        </View>

        <AppText>
          {item.sender_address !== active_wallet_address
            ? `+ ${Array.isArray(item.amount) ? item.amount[ 0 ] : item.amount
            } USDC`
            : `- ${Array.isArray(item.amount) ? item.amount[ 0 ] : item.amount
            } USDC`}
        </AppText>
        <View className="w-full flex-row items-center">
          <AppText className="text-gray-500 text-sm mt-1">
            {item.sender_address !== active_wallet_address ? "From " : "To "}
          </AppText>
          <AppText
            numberOfLines={1}
            ellipsizeMode="tail"
            className="truncate text-sm text-brand-700 flex-1"
          >
            {item.sender_address !== active_wallet_address
              ? item.sender_address
              : item.recipient_address}
          </AppText>
        </View>

        <AppText className="text-gray-800 text-sm mt-1">
          {item.blockchain}
        </AppText>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center w-full">
        <AppText className="text-[20px] text-center w-full">
          Loading Recent Activities
        </AppText>
      </View>
    );
  }

  if (!data || !data.data.transactions || data.data.transactions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center w-full">
        <AppText className="text-[20px] text-center w-full">
          No recent activities recorded
        </AppText>
      </View>
    );
  }

  return (
    <View className="px-6">
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View className="py-3">
            <AppText className="text-gray-500 text-base font-bold">
              {title}
            </AppText>
          </View>
        )}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (
            loadingMoreRef.current ||
            isFetching ||
            page >= data?.data.totalPage
          ) {
            return;
          }

          loadingMoreRef.current = true;
          setPage((prev) => prev + 1);
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setPage(1);
              onRefresh();
            }}
          />
        }
        ListFooterComponent={isFetching
          ? <AppText className="text-center p-3">Loading more...</AppText>
          : null}
      />
    </View>
  );
};

export default RecentActivities;
