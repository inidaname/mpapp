import type React from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";
import { TouchableOpacity, View } from "react-native";
import HeaderSide from "../components/Main/HeaderSide";
import USDC from "../../assets/Web3Icons/usdc_logo.svg";
import AppText, { FigureText } from "../components/typo/AppText";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const CurrencyDetail: React.FC<Props> = ({ navigation }) => {
  return (
    <View className="flex-1 bg-white px-0">
      <HeaderSide heading="Currency Detail" isWithBack />
      <View className="items-center py-5 mt-5 justify-center px-6">
        <USDC />
        <FigureText className="text-6xl font-montserrat font-bold text-gray-800 mt-6">
          $2,803<FigureText className="font-bold text-gray-500 mt-2">
            .12
          </FigureText>
        </FigureText>
        <FigureText
          weight="bold"
          className="inline-block align-base text-xl/6 mt-4"
        >
          = 2803.12
          <FigureText className="translate-y-{4} inline-block align-bottom text-sm/6">
            USD
          </FigureText>
        </FigureText>
        <View className="w-full flex-row justify-around items-start mt-14">
          <TouchableOpacity className="justify-center items-center">
            <View className="bg-gray-200 w-20 h-20 rounded-full mb-3 items-center justify-center">
              <MaterialIcons name="call-made" size={40} color={"#215CE1"} />
            </View>
            <AppText className="text-lg text-center">Send</AppText>
          </TouchableOpacity>
          <TouchableOpacity>
            <View className="bg-gray-200 w-20 h-20 rounded-full mb-3 items-center justify-center">
              <MaterialIcons name="call-received" size={40} color={"#215CE1"} />
            </View>
            <AppText className="text-lg text-center">Receive</AppText>
          </TouchableOpacity>
          <TouchableOpacity className="justify-center items-center">
            <View className="bg-gray-200 w-20 h-20 rounded-full mb-3 items-center justify-center">
              <MaterialIcons name="swap-horiz" size={40} color={"#215CE1"} />
            </View>
            <AppText className="text-lg text-center">Convert</AppText>
          </TouchableOpacity>
          <TouchableOpacity className="justify-center items-center">
            <View className="bg-gray-200 w-20 h-20 rounded-full mb-3 items-center justify-center">
              <MaterialIcons name="add" size={40} color={"#215CE1"} />
            </View>
            <AppText className="text-lg text-center">Add Funds</AppText>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 w-full bg-gray-300 mt-5 rounded-t-[40px]"></View>
    </View>
  );
};

export default CurrencyDetail;
