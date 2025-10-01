import type React from "react";

import { View } from "react-native";

import HeaderSide from "../components/Main/HeaderSide";
import AppText from "../components/typo/AppText";
import NetworkPerson from "../../assets/network_person.svg";
import ButtonComponent from "../components/Button";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";

interface Props extends NativeStackScreenProps<FullNavStack> {}

const OfflinePaymentScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View className="justify-between items-center flex-1 bg-white">
      <HeaderSide heading="Offline Payment" isWithBack />
      <View className="justify-center items-center px-4">
        <View className="p-8 bg-gray-100/60 rounded-full justify-center items-center">
          <View className="p-8 bg-gray-200/60 rounded-full justify-center items-center">
            <View className="p-2 bg-brand-600 rounded-full justify-center items-center">
              <NetworkPerson />
            </View>
          </View>
        </View>
        <AppText weight="medium" className="text-brand-700 mt-8 text-2xl">
          Make Your Offline Payments!!
        </AppText>
        <AppText className="text-center px-2 mt-4 text-lg">
          Send money to nearby users even when you're offline! Connect with
          another device using Bluetooth or NFC and your payment will sync
          automatically when you're online again.
        </AppText>
      </View>
      <View className="px-4 w-full">
        <ButtonComponent
          label="Get Started"
          onPress={() => navigation.navigate("DeviceProximityScreen")}
        />
      </View>
    </View>
  );
};

export default OfflinePaymentScreen;
