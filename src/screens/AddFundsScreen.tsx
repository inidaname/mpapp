import type React from "react";

import { Modal, TouchableOpacity, View } from "react-native";

import HeaderSide from "../components/Main/HeaderSide";
import AppText, { FigureText } from "../components/typo/AppText";
import USDC from "../../assets/Web3Icons/usdc_logo.svg";

import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { useState } from "react";
import ButtonComponent from "../components/Button";

const AddFundsScreen: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [successVisible, setSuccessVisible] = useState(false);

  const handlePress = (val: string) => {
    if (val === "x") {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      setAmount((prev) => prev + val);
    }
  };

  return (
    <View className="flex-1 w-full bg-white">
      <HeaderSide heading="Add Money" isWithBack />
      <View className="w-full mt-8 px-6">
        <AppText className="text-gray-600 mb-2">Add To??</AppText>
        <View className="flex-row items-center border border-gray-200 rounded-xl px-3 py-3 mb-6">
          <USDC width={20} height={20} color="#1D4ED8" />
          <AppText className="ml-2 text-blue-600 font-semibold">USDC</AppText>
        </View>
      </View>

      <View className="w-full flex-1 mt-20 px-6">
        <View className="items-center mb-4">
          <FigureText className="text-6xl font-semibold">
            ${amount || ""}
          </FigureText>
        </View>
        <View className="w-full border-t border-gray-200 my-3" />
        <AppText className="text-center text-gray-500 mb-8">
          Available Account Balance: $750.00
        </AppText>

        <View className="flex-row flex-wrap justify-center">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "x"].map((
            key,
          ) => (
            <TouchableOpacity
              key={key}
              onPress={() => handlePress(key)}
              className="w-1/4 mx-3 p-4 items-center justify-center"
            >
              <View className="bg-gray-100 w-24 h-16 rounded-2xl items-center justify-center">
                <FigureText className="text-2xl font-semibold">
                  {key}
                </FigureText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View className="px-6 mt-6">
          <ButtonComponent
            label="Add"
            onPress={() => setSuccessVisible(true)}
          />
        </View>
      </View>

      <Modal
        visible={successVisible}
        animationType="slide"
        transparent
        allowSwipeDismissal
      >
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white rounded-2xl p-6 w-4/5">
            <View className="items-center mb-4">
              <View className="bg-gray-100 rounded-full h-36 w-36 justify-center items-center my-6 mt-8">
                <View className="bg-gray-200 rounded-full h-28 w-28 justify-center items-center">
                  <View className="bg-brand-700 w-20 h-20 rounded-full items-center justify-center">
                    <MaterialIcons name="check" size={36} color="white" />
                  </View>
                </View>
              </View>
              <AppText className="text-xl text-gray-400">
                Amount Added Successfully
              </AppText>
              <FigureText className="text-4xl mt-2">
                ${amount || "0"}
              </FigureText>
            </View>

            {/* Transaction details */}
            <View className="space-y-2">
              <View className="flex-row justify-between my-2">
                <AppText className="text-gray-600">Transaction ID</AppText>
                <AppText>2345678</AppText>
              </View>
              <View className="flex-row justify-between my-2">
                <AppText className="text-gray-600">Wallet</AppText>
                <AppText>USDC</AppText>
              </View>
              <View className="flex-row justify-between my-2">
                <AppText className="text-gray-600">Wallet Address</AppText>
                <AppText numberOfLines={1}>23TXN1234567890</AppText>
              </View>
              <View className="flex-row justify-between my-2">
                <AppText className="text-gray-600">Date & Time</AppText>
                <AppText>Apr, 10, 2023 | 09:00AM</AppText>
              </View>
              <View className="flex-row justify-between my-2">
                <AppText className="text-gray-600">You Spend</AppText>
                <AppText>${(Number(amount) || 0).toFixed(2)}</AppText>
              </View>
              <View className="flex-row justify-between my-2">
                <AppText className="text-gray-600">Processing Fee</AppText>
                <AppText>$1.50</AppText>
              </View>
            </View>

            <TouchableOpacity
              className="mt-6 bg-blue-600 py-3 rounded-xl"
              onPress={() => setSuccessVisible(false)}
            >
              <AppText className="text-white text-center font-semibold">
                Close
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddFundsScreen;
