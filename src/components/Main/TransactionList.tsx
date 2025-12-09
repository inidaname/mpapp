import MaterialIcons from "@react-native-vector-icons/material-icons";
import type React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import AppText, { FigureText } from "../typo/AppText";
import { useGetTransactionQuery } from "../../service/endpoints/transactions-endpoints";
import { useEffect, useState } from "react";
import { useRefreshUserAndWallet } from "../../hooks/useRefreshProfileAndWallet";
import { formatRelativeTime } from "../../helpers/formatRelativeTime";
import { useAppSelector } from "../../store/redux";

const Transactions: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch, isFetching } = useGetTransactionQuery({
    page,
  });

  const { active_wallet_address } = useAppSelector((state) => state.wallet);

  const { refreshing, onRefresh } = useRefreshUserAndWallet(refetch);
  const [allTransactions, setAllTransactions] = useState<TransactionsList[]>(
    [],
  );

  useEffect(() => {
    if (data?.data?.transactions) {
      if (page === 1) {
        setAllTransactions(data.data.transactions);
      } else {
        setAllTransactions((prev) => [...prev, ...data.data.transactions]);
      }
    }
  }, [data, page]);

  const renderItem = ({ item }: { item: TransactionsList }) => (
    <View className="bg-white w-full py-4 px-4 flex-row rounded-xl items-center justify-start my-3">
      <View className="w-16 h-16 rounded-full bg-[#215CE11A] items-center justify-center mr-4">
        <MaterialIcons
          name={item.sender_address !== active_wallet_address
            ? "south-west"
            : "north-east"}
          size={30}
          color={item.sender_address !== active_wallet_address
            ? "#215CE1"
            : "#c22828ff"}
        />
      </View>
      <View className="flex-1 justify-between flex-row items-center">
        <View className="flex-1">
          <AppText
            numberOfLines={1}
            ellipsizeMode="tail"
            weight="light"
            className="text-2xl text-gray-900 truncate w-1/2"
          >
            {item.recipient_address}
          </AppText>
          <AppText className="text-gray-400">
            {formatRelativeTime(item.created_at)}
          </AppText>
        </View>
        <View className="items-end">
          <FigureText weight="bold" className="text-2xl text-gray-900">
            $ {item.amount}
          </FigureText>
          {/* <FigureText className="text-gray-400">100 USD</FigureText> */}
        </View>
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
    <View className="w-full">
      <FlatList
        data={allTransactions}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (!isFetching && page < data?.data.totalPage) {
            setPage((prev) => prev + 1);
          }
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
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center w-full">
            <AppText className="text-[20px] text-center w-full">
              No recent activities recorded
            </AppText>
          </View>
        }
      />
      {
        /* <View className="bg-white w-full py-4 px-4 flex-row rounded-xl items-center justify-start my-3">
        <View className="w-16 h-16 rounded-full bg-[#FF23231A] items-center justify-center mr-4">
          <MaterialIcons
            name="north-east"
            size={40}
            color={"#FF2323"}
          />
        </View>
        <View className="flex-1 justify-between flex-row items-center">
          <View>
            <AppText weight="light" className="text-2xl text-gray-900">
              John Doe
            </AppText>
            <AppText className="text-gray-400">
              Apr 10, 2024 09:20 AM
            </AppText>
          </View>
          <View className="items-end">
            <FigureText weight="bold" className="text-2xl text-gray-900">
              $ 150
            </FigureText>
            <FigureText className="text-gray-400">100 USD</FigureText>
          </View>
        </View>
      </View>
      <View className="bg-white w-full py-4 px-4 flex-row rounded-xl items-center justify-start my-3">
        <View className="w-16 h-16 rounded-full bg-[#50A99A1A] items-center justify-center mr-4">
          <MaterialIcons
            name="swap-horiz"
            size={40}
            color={"#50A99A"}
          />
        </View>
        <View className="flex-1 justify-between flex-row items-center">
          <View>
            <AppText weight="light" className="text-2xl text-gray-900">
              John Doe
            </AppText>
            <AppText className="text-gray-400">
              Apr 10, 2024 09:20 AM
            </AppText>
          </View>
          <View className="items-end">
            <FigureText weight="bold" className="text-2xl text-gray-900">
              $ 150
            </FigureText>
            <FigureText className="text-gray-400">100 USD</FigureText>
          </View>
        </View>
      </View>
      <View className="bg-white w-full py-4 px-4 flex-row rounded-xl items-center justify-start my-3">
        <View className="w-16 h-16 rounded-full bg-[#D1F5611A] items-center justify-center mr-4">
          <MaterialIcons
            name="mobile-friendly"
            size={40}
            color={"#D1F561"}
          />
        </View>
        <View className="flex-1 justify-between flex-row items-center">
          <View>
            <AppText weight="light" className="text-2xl text-gray-900">
              John Doe
            </AppText>
            <AppText className="text-gray-400">
              Apr 10, 2024 09:20 AM
            </AppText>
          </View>
          <View className="items-end">
            <FigureText weight="bold" className="text-2xl text-gray-900">
              $ 150
            </FigureText>
            <FigureText className="text-gray-400">100 USD</FigureText>
          </View>
        </View>
      </View> */
      }
    </View>
  );
};

export default Transactions;
