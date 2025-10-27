import type React from "react";

import { TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import LinearGradient from "react-native-linear-gradient";
import AppText, { PoppinText } from "../typo/AppText";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FullNavStack } from "../../types/types";
import { useGetAccountsQuery } from "../../service/endpoints/external-accounts";

interface Props {
  text: string;
}

const BankingDetails: React.FC<Props> = ({ text }) => {
  const navigate = useNavigation<NativeStackNavigationProp<FullNavStack>>();
  const { data } = useGetAccountsQuery();
  console.log("data", data);

  return (
    <>
      <View className="w-full flex-row justify-between items-center p-6">
        <AppText weight="medium" className="text-lg">
          {text}
        </AppText>
        <TouchableOpacity
          onPress={() => navigate.navigate("AddBankScreen")}
          className="flex-row items-center p-2 justify-start"
        >
          <View className="bg-brand-700 rounded-full p-1">
            <MaterialIcons
              name="add"
              size={20}
              color="white"
            />
          </View>
          <AppText
            weight="medium"
            className="text-brand-700 ml-3 text-md"
          >
            Add New
          </AppText>
        </TouchableOpacity>
      </View>
      <View className="w-full flex-row justify-between items-center px-4 mb-10">
        <LinearGradient
          colors={["#437DFF", "#345398"]}
          start={{ x: 0.25, y: 0 }}
          end={{ x: 0.75, y: 1 }}
          style={{ borderRadius: 10 }}
          className="h-auto w-2/3 rounded-full mr-5 items-center justify-center"
        >
          <View className="w-full h-44 rounded-2xl p-6 justify-between">
            <PoppinText
              weight="bold"
              className="text-white font-bold text-lg"
            >
              ADRBank
            </PoppinText>
            <PoppinText className="text-white text-lg">
              **** **** **** 0329
            </PoppinText>

            <View>
              <PoppinText
                weight="light"
                className="text-white font-light text-sm"
              >
                Card Holder Name
              </PoppinText>
              <PoppinText
                weight="bold"
                className="text-white text-sm"
              >
                HILLERY NEVELIN
              </PoppinText>
            </View>
          </View>
        </LinearGradient>
        <LinearGradient
          colors={["#61F5D7", "#297825"]}
          start={{ x: 0.37, y: 0 }} // exact ~112deg mapping
          end={{ x: 0, y: 1 }}
          style={{ borderRadius: 10 }}
          className="h-auto w-2/3 rounded-full ml-2 items-center justify-center"
        >
          <View className="w-full h-44 rounded-2xl p-6 justify-between">
            <PoppinText
              weight="bold"
              className="text-white font-bold text-lg"
            >
              ADRBank
            </PoppinText>
            <PoppinText className="text-white text-lg">
              **** **** **** 0329
            </PoppinText>

            <View>
              <PoppinText
                weight="light"
                className="text-white font-light text-sm"
              >
                Card Holder Name
              </PoppinText>
              <PoppinText
                weight="bold"
                className="text-white text-sm"
              >
                HILLERY NEVELIN
              </PoppinText>
            </View>
          </View>
        </LinearGradient>
      </View>
    </>
  );
};

export default BankingDetails;
