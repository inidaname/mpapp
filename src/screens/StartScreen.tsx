import type React from "react";

import { Image, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";
import CreateWallet from "../components/Main/CreateWallets";
import GoToWallet from "../components/Main/GoToWalletDetail";
import { useGetUserProfileQuery } from "../service/endpoints/user-endpoints";
import { useAppSelector } from "../store/redux";

interface Props extends NativeStackScreenProps<FullNavStack> {}

const StartScreen: React.FC<Props> = ({ navigation }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useGetUserProfileQuery();
  const { active_wallet_address } = useAppSelector((state) => state.wallet);
  console.log("active_wallet_address", active_wallet_address);
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <View className="w-full items-center">
        <Image source={require("../../assets/logo.png")} />
        <View className="w-full mt-14 items-center px-6">
          {!active_wallet_address && <CreateWallet navigation={navigation} />}
          {active_wallet_address && <GoToWallet navigation={navigation} />}
        </View>
      </View>
    </View>
  );
};

export default StartScreen;
