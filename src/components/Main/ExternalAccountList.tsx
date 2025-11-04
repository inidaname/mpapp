/* eslint-disable react-native/no-inline-styles */
import React from "react";

import { useGetAccountsQuery } from "../../service/endpoints/external-accounts";
import { View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { PoppinText } from "../typo/AppText";

const ExternalAccountList: React.FC = () => {
  const { data } = useGetAccountsQuery();

  if (data?.data.count === 0) {
    return (
      <View className="w-full flex-row justify-between h-20 items-center px-4 mb-10" />
    );
  }

  return (
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
  );
};

export default ExternalAccountList;
