/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";

import { Modal, TouchableOpacity, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/types";
import HeaderSide from "../components/Main/HeaderSide";
import KeyPad from "../components/utils/KeyPad";
import ButtonComponent from "../components/Button";
import BankingDetails from "../components/Main/BankingDetails";
import { useAppSelector } from "../store/redux";
import { useConvertFundsToBankMutation } from "../service/endpoints/convert-endpoints";
import AppText from "../components/typo/AppText";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const SendToBankScreen: React.FC<Props> = () => {
  const [amount, setAmount] = useState("");
  const [successVisible, setSuccessVisible] = useState(false);
  const { account_id } = useAppSelector((state) => state.externalAccounts);
  const { active_wallet } = useAppSelector((state) => state.wallet);
  const { usdcWallet } = useAppSelector((state) => state.USDCWallet);

  const [convert, { isLoading }] = useConvertFundsToBankMutation();

  const handleConvert = async () => {
    if (
      !account_id || !active_wallet || Number(usdcWallet?.amount) === 0 ||
      Number(amount) <= 0 || !usdcWallet || !usdcWallet.token
    ) return;
    try {
      await convert({
        external_account_id: account_id,
        amount,
        address: usdcWallet?.token.tokenAddress,
        chain: usdcWallet.token.blockchain,
        currency: usdcWallet.token.symbol,
        tokenId: usdcWallet?.token.id,
      }).unwrap();
      setSuccessVisible(true);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={40}
    >
      <View className="flex-1 w-full bg-white">
        <HeaderSide heading="Transfer To Bank" isWithBack />

        <BankingDetails text="Select Bank Account" />

        <KeyPad amount={amount} setAmount={setAmount} />
        <View className="px-6 mt-6">
          <ButtonComponent
            label="Add"
            isLoading={isLoading}
            isDisabled={Number(amount) <= 0 || !account_id}
            onPress={handleConvert}
          />
        </View>
        <Modal
          visible={successVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setSuccessVisible(false)}
        >
          {/* Backdrop */}
          <View className="flex-1 bg-black/50 items-center justify-center px-4">
            {/* Modal Container */}
            <View className="w-full bg-white rounded-3xl p-6 max-h-[85%]">
              {/* Check Icon */}
              <View className="items-center mb-6">
                <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center">
                  <MaterialIcons
                    name="check-circle"
                    size={48}
                    color="#215CE1"
                  />
                </View>
              </View>

              {/* Title */}
              <AppText className="text-center text-xl font-semibold text-gray-900">
                Payment Success!!
              </AppText>

              {/* Amount */}
              <AppText className="text-center text-4xl font-bold text-black mt-2">
                $133.631
              </AppText>

              <View className="h-px bg-gray-200 my-6" />

              {/* Details */}
              <InfoRow label="Transaction ID" value="2345678" />
              <InfoRow label="Account Holder Name" value="Sarah Johnson" />
              <InfoRow label="Bank Name" value="HBL" />
              <InfoRow label="Account No" value="*********012" />
              <InfoRow label="Date & Time" value="Apr, 10, 2023 | 09:00AM" />
              <InfoRow label="You spend" value="$ 132.50" />
              <InfoRow label="Processing Fee" value="$ 1.50" />

              {/* Receipt */}
              <TouchableOpacity className="mt-10">
                <AppText className="text-center text-blue-600 text-lg font-semibold">
                  Download Receipt
                </AppText>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                className="mt-6"
                onPress={() => setSuccessVisible(false)}
              >
                <AppText className="text-center text-gray-600 text-base">
                  Close
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAwareScrollView>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between my-2">
      <AppText className="text-gray-500 text-base">{label}</AppText>
      <AppText className="text-gray-900 text-base font-medium">{value}</AppText>
    </View>
  );
}

export default SendToBankScreen;
