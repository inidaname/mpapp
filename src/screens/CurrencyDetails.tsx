import type React from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";
import { ScrollView, TouchableOpacity, View } from "react-native";
import HeaderSide from "../components/Main/HeaderSide";
import USDC from "../../assets/Web3Icons/usdc_logo.svg";
import AppText, { FigureText } from "../components/typo/AppText";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const CurrencyDetail: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView className="flex-1 bg-white px-0">
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
          <TouchableOpacity
            onPress={() => navigation.navigate("SendToBankScreen")}
            className="justify-center items-center"
          >
            <View className="bg-gray-200 w-20 h-20 rounded-full mb-3 items-center justify-center">
              <MaterialIcons name="north-east" size={40} color={"#215CE1"} />
            </View>
            <AppText className="text-lg text-center">Send</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("RecentActivitiesScreen")}
            className="justify-center items-center"
          >
            <View className="bg-gray-200 w-20 h-20 rounded-full mb-3 items-center justify-center">
              <MaterialIcons name="south-west" size={40} color={"#215CE1"} />
            </View>
            <AppText className="text-lg text-center">Receive</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ConversionScreen")}
            className="justify-center items-center"
          >
            <View className="bg-gray-200 w-20 h-20 rounded-full mb-3 items-center justify-center">
              <MaterialIcons name="swap-horiz" size={40} color={"#215CE1"} />
            </View>
            <AppText className="text-lg text-center">Convert</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddFundsScreen")}
            className="justify-center items-center"
          >
            <View className="bg-gray-200 w-20 h-20 rounded-full mb-3 items-center justify-center">
              <MaterialIcons name="add" size={40} color={"#215CE1"} />
            </View>
            <AppText className="text-lg text-center">Add Funds</AppText>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 min-h-[50vh] w-full bg-gray-200 mt-5 rounded-t-[40px] px-6 py-8">
        <AppText weight="semibold" className="text-xl">Description</AppText>
        <AppText weight="regular" className="text-lg/5 mt-2">
          Shows USDC balance, recent transactions, and options to send, receive,
          or convert USDC. Educational content about USDC's stability and
          benefits. recent transactions, and options to send, receive
        </AppText>

        <AppText weight="semibold" className="text-xl mt-4">
          Transactions
        </AppText>
        <View className="w-full justify-start items-center mt-4">
          <View className="bg-white w-full py-4 px-4 flex-row rounded-xl items-center justify-start my-3">
            <View className="w-16 h-16 rounded-full bg-[#215CE11A] items-center justify-center mr-4">
              <MaterialIcons
                name="south-west"
                size={40}
                color={"#215CE1"}
              />
            </View>
            <View className="flex-1 justify-between flex-row items-center">
              <View>
                <AppText weight="light" className="text-2xl text-gray-900">
                  John Doe
                </AppText>
                <AppText className="text-gray-400">
                  Apr 10, 2024 09:20 AM
                </AppText>
              </View>
              <View className="items-end">
                <FigureText weight="bold" className="text-2xl text-gray-900">
                  $ 150
                </FigureText>
                <FigureText className="text-gray-400">100 USD</FigureText>
              </View>
            </View>
          </View>
          <View className="bg-white w-full py-4 px-4 flex-row rounded-xl items-center justify-start my-3">
            <View className="w-16 h-16 rounded-full bg-[#FF23231A] items-center justify-center mr-4">
              <MaterialIcons
                name="north-east"
                size={40}
                color={"#FF2323"}
              />
            </View>
            <View className="flex-1 justify-between flex-row items-center">
              <View>
                <AppText weight="light" className="text-2xl text-gray-900">
                  John Doe
                </AppText>
                <AppText className="text-gray-400">
                  Apr 10, 2024 09:20 AM
                </AppText>
              </View>
              <View className="items-end">
                <FigureText weight="bold" className="text-2xl text-gray-900">
                  $ 150
                </FigureText>
                <FigureText className="text-gray-400">100 USD</FigureText>
              </View>
            </View>
          </View>
          <View className="bg-white w-full py-4 px-4 flex-row rounded-xl items-center justify-start my-3">
            <View className="w-16 h-16 rounded-full bg-[#50A99A1A] items-center justify-center mr-4">
              <MaterialIcons
                name="swap-horiz"
                size={40}
                color={"#50A99A"}
              />
            </View>
            <View className="flex-1 justify-between flex-row items-center">
              <View>
                <AppText weight="light" className="text-2xl text-gray-900">
                  John Doe
                </AppText>
                <AppText className="text-gray-400">
                  Apr 10, 2024 09:20 AM
                </AppText>
              </View>
              <View className="items-end">
                <FigureText weight="bold" className="text-2xl text-gray-900">
                  $ 150
                </FigureText>
                <FigureText className="text-gray-400">100 USD</FigureText>
              </View>
            </View>
          </View>
          <View className="bg-white w-full py-4 px-4 flex-row rounded-xl items-center justify-start my-3">
            <View className="w-16 h-16 rounded-full bg-[#D1F5611A] items-center justify-center mr-4">
              <MaterialIcons
                name="mobile-friendly"
                size={40}
                color={"#D1F561"}
              />
            </View>
            <View className="flex-1 justify-between flex-row items-center">
              <View>
                <AppText weight="light" className="text-2xl text-gray-900">
                  John Doe
                </AppText>
                <AppText className="text-gray-400">
                  Apr 10, 2024 09:20 AM
                </AppText>
              </View>
              <View className="items-end">
                <FigureText weight="bold" className="text-2xl text-gray-900">
                  $ 150
                </FigureText>
                <FigureText className="text-gray-400">100 USD</FigureText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default CurrencyDetail;
