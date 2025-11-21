import React from "react";
import { FlatList, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";

import AppText from "../typo/AppText";
import { useGetTransactionQuery } from "../../service/endpoints/transactions-endpoints";
import { useAppSelector } from "../../store/redux";

const RecentActivities: React.FC = () => {
  const { data, isLoading } = useGetTransactionQuery({});
  const { active_wallet_address } = useAppSelector((state) => state.wallet);

  const renderItem = ({ item }: { item: TransactionsList }) => (
    <View className="flex-row w-full p-4">
      <View className="h-14 w-14 items-center justify-center bg-gray-200 rounded-full">
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

      <View className="w-full ml-5 pr-5 flex-1">
        <AppText weight="bold" className="text-xl">
          {item.sender_address !== active_wallet_address
            ? `USDC Received`
            : `USDC Sent`}
        </AppText>

        <AppText>
          {item.sender_address !== active_wallet_address
            ? `You have received ${
              Array.isArray(item.amount) ? item.amount[0] : item.amount
            } USDC`
            : `You have succesfully sent payment of ${
              Array.isArray(item.amount) ? item.amount[0] : item.amount
            } USDC`}
        </AppText>
        <View className="w-full flex-row items-center">
          <AppText className="text-gray-500 text-sm mt-1">
            {item.sender_address !== active_wallet_address
              ? "From Address "
              : "To Address "}
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

        <AppText className="text-gray-500 text-sm">
          Network: {item.blockchain}
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

  if (!data || data.data.length === 0) {
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
      <FlatList
        data={data.data || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RecentActivities;
