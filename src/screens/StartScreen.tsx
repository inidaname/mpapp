import type React from "react";

import { Image, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";
import ButtonComponent from "../components/Button";
import CreateWallet from "../components/Main/CreateWallets";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const StartScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <View className="w-full items-center">
        <Image source={require("../../assets/logo.png")} />
        <View className="w-full mt-14 items-center px-6">
          <CreateWallet navigation={navigation} />
          <ButtonComponent
            label="I already have a wallet"
            onPress={() => navigation.navigate("Home")}
          />
        </View>
      </View>
    </View>
  );
};

export default StartScreen;
