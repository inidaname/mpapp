import type React from "react";

import { Image, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import HeaderSide from "../components/Main/HeaderSide";
import AppText, { FigureText } from "../components/typo/AppText";
import { RootStackParamList } from "../types/types";
import ActiveNetworks from "../components/Main/ActiveNextworks";
import { useAppSelector } from "../store/redux";
import { selectUSDC } from "../helpers/select_usdc";
import { useGetWalletByIdQuery } from "../service/endpoints/wallets-endpoints";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const WalletScreen: React.FC<Props> = ({}) => {
  const { active_wallet } = useAppSelector((state) => state.wallet);
  const { data } = useGetWalletByIdQuery(active_wallet?.id ?? "");

  return (
    <View className="flex-1 bg-white px-6">
      <HeaderSide heading="My Wallet" isWithBack />
      <View className="justify-between min-h-20 w-full mt-6 items-center">
        <AppText className="text-lg text-gray-500">
          Total Balanace In USDC
        </AppText>
        <View className="flex-row w-full items-center justify-center mt-6">
          <Image
            source={require("../../assets/USDC.png")}
            width={400}
            height={400}
            resizeMethod="scale"
            resizeMode="cover"
            className="w-14 h-14"
          />
          <FigureText className="text-6xl font-bold font-montserrat  ml-2 text-gray-800">
            {data && Number(selectUSDC(data.data)?.amount ?? 0).toFixed(2)}
          </FigureText>
        </View>
      </View>
      <ActiveNetworks />
    </View>
  );
};

export default WalletScreen;
