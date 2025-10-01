import type React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { FullNavStack } from "../types/types";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import AppText from "../components/typo/AppText";
import { useState } from "react";
import { useGetCountriesQuery } from "../service/endpoints/util-endpoitns";
import HeaderSide from "../components/Main/HeaderSide";

interface Props extends NativeStackScreenProps<FullNavStack> {}

const ChangeCountry: React.FC<Props> = ({ navigation }) => {
  const [selected, setSelected] = useState<CountriesAPI | null>(null);

  const { data: countries, isLoading } = useGetCountriesQuery();

  const handleContinue = () => {
    if (selected) {
      console.log("selected", selected);
      navigation.goBack();
    }
  };

  if (isLoading) {
    return <AppText>Loading Countries</AppText>;
  }

  return (
    <View className="flex-1 px-4 bg-white">
      <HeaderSide heading="Country" isWithBack />
      <ScrollView className="mt-10">
        {countries?.map((country) => (
          <TouchableOpacity
            key={country.code}
            className="flex-row items-center justify-between py-0 w-full"
            onPress={() => setSelected(country)}
          >
            <View className="px-4 rounded-2xl my-4 py-4 justify-between items-center bg-gray-300/20 flex flex-row w-full">
              <View className="flex flex-row items-center">
                <Image
                  className="w-10 h-10 rounded-full"
                  source={{
                    uri:
                      `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`,
                  }}
                />
                <AppText weight="medium" className="text-xl uppercase mx-2">
                  {country.name}
                </AppText>
                <AppText className="text-2xl text-gray-500">
                  {country.code}
                </AppText>
              </View>
              <View
                className={`w-8 h-8 items-center justify-center rounded-full ${
                  selected?.code === country.code
                    ? "border border-brand-500"
                    : "border border-gray-400"
                }`}
              >
                {selected?.code === country.code && (
                  <View
                    className={`w-4 h-4 items-center justify-center border-brand-500 bg-brand-500 rounded-full`}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        disabled={!selected}
        onPress={handleContinue}
        className={`w-full px-6 py-3 rounded-2xl h-16 justify-center items-center mb-10 ${
          selected ? "bg-brand-700" : "bg-brand-300"
        }`}
      >
        <AppText weight="semibold" className="text-white text-xl">
          Continue
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export default ChangeCountry;
