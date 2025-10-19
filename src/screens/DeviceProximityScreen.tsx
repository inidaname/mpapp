import React from "react";
import { Image, View } from "react-native";
import HeaderSide from "../components/Main/HeaderSide";
import AppText from "../components/typo/AppText";
import ButtonComponent from "../components/Button";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";

interface Props extends NativeStackScreenProps<FullNavStack> {}

const DeviceProximityScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View className="justify-between items-center flex-1 bg-white">
      <HeaderSide heading="Set Up Device Proximity" isWithBack />
      <View className="w-full px-6 mt-8 items-center justify-center">
        <Image
          source={require("../../assets/user_phone_hand.png")}
          className="w-[200]"
        />
        <AppText className="text-2xl mt-8 font-medium">
          Enable Bluetooth/NFC
        </AppText>
        <AppText className="text-md font-thin text-center mt-2">
          Enable Your phones Bluetooth or NFC to connect with the recipient
          device.
        </AppText>
      </View>

      <View className="px-4 w-full">
        <ButtonComponent
          label="Continue"
          onPress={() => navigation.navigate("NearbyUsers")}
        />
      </View>
    </View>
  );
};

export default DeviceProximityScreen;
