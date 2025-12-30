import type React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";
import { FlatList, TouchableOpacity, View } from "react-native";
import HeaderSide from "../components/Main/HeaderSide";
import USDC from "../../assets/Web3Icons/usdc_logo.svg";
import AppText, { FigureText } from "../components/typo/AppText";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import Transactions from "../components/Main/TransactionList";
import { useAppSelector } from "../store/redux";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "CurrencyDetail"> { }

const CurrencyDetail: React.FC<Props> = ({ navigation, route }) => {
  const { usdcWallet } = useAppSelector((state) => state.USDCWallet);

  // FlatList requires data but we only need the header; use an empty list.
  return (
    <FlatList
      data={[]}
      keyExtractor={() => "header"}
      renderItem={null}
      ListHeaderComponent={
        <>
          <HeaderSide heading="Currency Detail" isWithBack />

          {/* Balance Section */}
          <View className="items-center py-5 mt-5 justify-center px-6">
            <USDC />

            <FigureText className="text-6xl font-montserrat font-bold text-gray-800 mt-6">
              ${Number(usdcWallet?.amount ?? 0).toFixed(2)}
            </FigureText>

            <FigureText weight="bold" className="text-xl mt-4">
              = {Number(usdcWallet?.amount ?? 0).toFixed(2)}
              <FigureText className="text-sm align-bottom">USD</FigureText>
            </FigureText>

            {/* Actions Row */}
            <View className="w-full flex-row justify-around items-start mt-14">
              {/* Send */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Home", {
                    screen: "Send",
                    params: { blockchain: route.params.currency },
                  })}
                className="justify-center items-center"
              >
                <View className="bg-gray-200 w-20 h-20 rounded-full mb-3 items-center justify-center">
                  <MaterialIcons name="north-east" size={40} color="#215CE1" />
                </View>
                <AppText className="text-lg text-center">Send</AppText>
              </TouchableOpacity>

              {/* Receive */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Home", {
                    screen: "Receive",
                  })}
                className="justify-center items-center"
              >
                <View className="bg-gray-200 w-20 h-20 rounded-full mb-3 items-center justify-center">
                  <MaterialIcons name="south-west" size={40} color="#215CE1" />
                </View>
                <AppText className="text-lg text-center">Receive</AppText>
              </TouchableOpacity>

              {/* Convert */}
              <TouchableOpacity
                onPress={() => navigation.navigate("ConversionScreen")}
                className="justify-center items-center"
              >
                <View className="bg-gray-200 w-20 h-20 rounded-full mb-3 items-center justify-center">
                  <MaterialIcons name="swap-horiz" size={40} color="#215CE1" />
                </View>
                <AppText className="text-lg text-center">Convert</AppText>
              </TouchableOpacity>

              {/* Add Funds */}
              <TouchableOpacity
                onPress={() => navigation.navigate("AddFundsScreen")}
                className="justify-center items-center"
              >
                <View className="bg-gray-200 w-20 h-20 rounded-full mb-3 items-center justify-center">
                  <MaterialIcons name="add" size={40} color="#215CE1" />
                </View>
                <AppText className="text-lg text-center">Add Funds</AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description + Transactions Section */}
          <View className="w-full bg-gray-200 mt-5 rounded-t-[40px] px-6 py-8">
            <AppText weight="semibold" className="text-xl">
              Description
            </AppText>

            <AppText className="text-lg mt-2">
              Shows USDC balance, recent transactions, and options to send,
              receive, or convert USDC.
            </AppText>

            <AppText weight="semibold" className="text-xl mt-6">
              Transactions
            </AppText>

            <Transactions />
          </View>
        </>
      }
    />
  );
};

export default CurrencyDetail;
