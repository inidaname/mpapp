/* eslint-disable react-native/no-inline-styles */
import type React from "react";

import { View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/types";
import HeaderSide from "../components/Main/HeaderSide";
import KeyPad from "../components/utils/KeyPad";
import { useState } from "react";
import ButtonComponent from "../components/Button";
import BankingDetails from "../components/Main/BankingDetails";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const SendToBankScreen: React.FC<Props> = () => {
  const [amount, setAmount] = useState("");
  const [_, setSuccessVisible] = useState(false);
  return (
    <View className="flex-1 w-full bg-white">
      <HeaderSide heading="Transfer To Bank" isWithBack />

      <BankingDetails text="Select Bank Account" />

      <KeyPad amount={amount} setAmount={setAmount} />
      <View className="px-6 mt-6">
        <ButtonComponent
          label="Add"
          onPress={() => setSuccessVisible(true)}
        />
      </View>
    </View>
  );
};

export default SendToBankScreen;
