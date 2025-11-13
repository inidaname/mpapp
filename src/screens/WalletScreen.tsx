import type React from "react";

import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import HeaderSide from "../components/Main/HeaderSide";
import AppText from "../components/typo/AppText";
import { RootStackParamList } from "../types/types";
import ActiveNetworks from "../components/Main/ActiveNextworks";
import { useAppSelector } from "../store/redux";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const WalletScreen: React.FC<Props> = ({}) => {
  const { active_wallet } = useAppSelector((state) => state.wallet);

  return (
    <View className="flex-1 bg-white px-6">
      <HeaderSide heading="My Wallet" isWithBack />
      <View className="justify-between min-h-20 w-full mt-6 items-center">
        <AppText className="text-lg text-gray-500">
          Total Balanace In USDC
        </AppText>
        <Text className="text-6xl font-bold text-gray-800 mt-6">
          {Number(active_wallet?.balance).toPrecision(3)}
        </Text>
      </View>
      <ActiveNetworks />
    </View>
  );
};

export default WalletScreen;
