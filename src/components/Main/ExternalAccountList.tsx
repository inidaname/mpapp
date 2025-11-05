/* eslint-disable react-native/no-inline-styles */
import React from "react";

import { useGetAccountsQuery } from "../../service/endpoints/external-accounts";
import { ScrollView, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { PoppinText } from "../typo/AppText";
import { GRADIENTS_COLORS } from "../../data/gradient";

const ExternalAccountList: React.FC = () => {
  const { data } = useGetAccountsQuery();

  if (!data?.data || data.data.count === 0) {
    return (
      <View className="w-full flex-row justify-center h-20 items-center px-4 mb-10">
        <PoppinText className="text-lg font-light text-center">
          You do not have any account yet, add an account
        </PoppinText>
      </View>
    );
  }

  return (
    <View className="w-full flex-row justify-center items-center gap-5 px-4 mb-10">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 12,
        }}
      >
        {data.data.data.map((account, index) => (
          <LinearGradient
            key={account.id}
            colors={GRADIENTS_COLORS[index]}
            start={{ x: 0.25, y: 0 }}
            end={{ x: 0.75, y: 1 }}
            style={{ borderRadius: 10 }} // Saniyhassan+5@gmail.com
            className="h-auto w-2/3 rounded-full mr-5 items-center justify-center"
          >
            <View className="w-full h-44 rounded-2xl p-6 justify-between">
              <PoppinText
                weight="bold"
                className="text-white font-bold text-lg"
              >
                {account.bank_name}
              </PoppinText>
              <PoppinText className="text-white text-lg">
                **** **** **** {account.last_4}
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
                  {account.account_owner_name}
                </PoppinText>
              </View>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>
    </View>
  );
};

export default ExternalAccountList;
