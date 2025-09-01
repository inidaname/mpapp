import type React from "react";
import { useState } from "react";

import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";

import { MaterialIcons } from "@react-native-vector-icons/material-icons";

import { RootStackParamList } from "../types/types";
import HeaderSide from "../components/Main/HeaderSide";
import AppText, { FigureText } from "../components/typo/AppText";
import EURO from "../../assets/Web3Icons/euro_icon.svg";
import USDC from "../../assets/Web3Icons/usdc_logo.svg";
import ButtonComponent from "../components/Button";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const ConversionScreen: React.FC<Props> = () => {
  const { control } = useForm();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  return (
    <ScrollView
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ flex: 1 }}
      className="flex-1 bg-white px-0"
    >
      <HeaderSide heading="Currency Conversion" isWithBack />
      <View className="w-full bg-white p-8 relative justify-center">
        <View className="bg-gray-200 rounded-2xl p-4 py-8 mb-6 shado z-9w">
          <AppText className="text-gray-500 mb-2">Convert From</AppText>
          <View className="flex-row items-center border border-blue-400 rounded-xl px-3 py-2">
            <TextInput
              keyboardType="decimal-pad"
              className="flex-1 text-lg text-black"
            />
            <TouchableOpacity className="flex-row items-center">
              <EURO width={20} height={20} color="#1D4ED8" />
              <AppText className="ml-1 text-blue-600 font-medium">
                EUR
              </AppText>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between mt-2">
            <AppText className="text-black font-medium">~ $210.0</AppText>
            <AppText className="text-gray-400">
              Available Balance: €200.01
            </AppText>
          </View>
        </View>

        {/* Swap Button */}
        <View className="items-center mb-6 absolute self-center mt-5 z-10">
          <TouchableOpacity className="bg-blue-600 w-20 h-20 rounded-full items-center justify-center">
            <MaterialIcons name="swap-vert" size={36} color="white" />
          </TouchableOpacity>
        </View>

        {/* Convert To */}
        <View className="bg-gray-200 rounded-2xl p-4 py-8 mt-6 shadow z-9">
          <AppText className="text-gray-500 mb-2">Convert To</AppText>
          <View className="flex-row items-center border border-blue-400 rounded-xl px-3 py-2">
            <TextInput
              keyboardType="decimal-pad"
              className="flex-1 text-lg text-black"
            />
            <TouchableOpacity className="flex-row items-center">
              <USDC width={20} height={20} color="#1D4ED8" />
              <AppText className="ml-1 text-blue-600 font-medium">
                USDC
              </AppText>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between mt-2">
            <AppText className="text-black font-medium">~ $79,709.0</AppText>
            <AppText className="text-gray-400">
              Available Balance: $79.709
            </AppText>
          </View>
        </View>
      </View>
      <View className="w-full px-6">
        <View className="w-full">
          <View className="w-full flex-row items-center my-1 justify-between">
            <AppText>Fx Rate</AppText>
            <AppText>$ 1 = € 0.0130</AppText>
          </View>
          <View className="w-full flex-row items-center my-1 justify-between">
            <AppText>Service Fee</AppText>
            <AppText>$ 1.40</AppText>
          </View>
          <View className="w-full border-t border-gray-100 mt-8" />
          <View className="w-full flex-row items-center my-1 justify-between">
            <AppText>You will Get</AppText>
            <AppText>$ 30.40</AppText>
          </View>
        </View>
      </View>
      <View className="px-6 bottom-10 justify-center items-center  w-full absolute">
        <ButtonComponent
          onPress={() => setConfirmVisible(true)}
          label="Convert"
        />
      </View>
      <Modal visible={confirmVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white rounded-t-[35px] p-6 h-[563px]">
            <AppText
              weight="bold"
              className="text-center text-2xl mt-4 font-semibold"
            >
              Confirm Conversion
            </AppText>

            {/* Conversion details */}
            <View className="flex-row justify-evenly items-center my-6">
              <View className="flex-row items-center">
                <EURO width={25} height={25} color="#1D4ED8" />
                <AppText className="mx-2 text-2xl">EUR</AppText>
              </View>
              <MaterialIcons name="swap-horiz" size={30} color="black" />
              <View className="flex-row items-center">
                <AppText className="mx-2 text-2xl">USDC</AppText>
                <USDC width={25} height={25} color="#1D4ED8" />
              </View>
            </View>

            <View className="w-full flex-1 justify-between">
              <View className="mb-2 flex-row justify-between">
                <AppText className="text-xl text-gray-500">
                  Convert From
                </AppText>
                <FigureText className="text-2xl">
                  €200.01
                </FigureText>
              </View>
              <View className="mb-2 flex-row justify-between">
                <AppText className="text-xl text-gray-500">Convert To</AppText>
                <FigureText className="text-2xl">
                  $79.709
                </FigureText>
              </View>
              <View className="mb-2 flex-row justify-between">
                <AppText className="text-xl text-gray-500">Fx Rate</AppText>
                <FigureText className="text-2xl">
                  $1 = €0.0130
                </FigureText>
              </View>
              <View className="mb-2 flex-row justify-between">
                <AppText className="text-xl text-gray-500">On-Ramp Fee</AppText>
                <FigureText className="text-2xl">$1.50</FigureText>
              </View>
              <View className="mb-4 flex-row justify-between">
                <AppText
                  weight="semibold"
                  className="font-semibold text-xl text-gray-500"
                >
                  You Receive
                </AppText>
                <FigureText className="text-2xl text-brand-700">
                  $30
                </FigureText>
              </View>

              <ButtonComponent
                onPress={() => {
                  setConfirmVisible(false);
                  setSuccessVisible(true);
                }}
                label="Confirm Conversion"
              />

              <Pressable onPress={() => setConfirmVisible(false)}>
                <AppText className="text-center text-gray-500">Cancel</AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={successVisible} animationType="fade" transparent>
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white rounded-2xl p-6 items-center w-4/5">
            <View className="bg-gray-100 rounded-full h-36 w-36 justify-center items-center my-6 mt-8">
              <View className="bg-gray-200 rounded-full h-28 w-28 justify-center items-center">
                <View className="bg-brand-700 w-20 h-20 rounded-full items-center justify-center">
                  <MaterialIcons name="check" size={36} color="white" />
                </View>
              </View>
            </View>
            <AppText
              weight="semibold"
              className="text-2xl text-center mb-2 font-semibold"
            >
              Conversion Success
            </AppText>
            <AppText className="text-center text-lg/1 mb-4 text-gray-500 mt-2">
              Congratulations! You have successfully converted currency from EUR
              to USDC.
            </AppText>
            <TouchableOpacity
              className="mr-4 mt-4 rounded-full absolute r-0 p-1 self-end bg-gray-800"
              onPress={() => setSuccessVisible(false)}
            >
              <MaterialIcons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ConversionScreen;
