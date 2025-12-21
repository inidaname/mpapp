/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/types";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import HeaderSide from "../components/Main/HeaderSide";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import AppText, { FigureText } from "../components/typo/AppText";
import SecuredCheck from "../../assets/green_check.svg";
import BankingDetails from "../components/Main/BankingDetails";
import { useGetUserProfileQuery } from "../service/endpoints/user-endpoints";
import { useGetCountriesQuery } from "../service/endpoints/util-endpoitns";
import StartKYC from "../components/screens/StartKYC";
import FastImage from 'react-native-fast-image';

import ActionRequired from "../components/Main/ActionRequired";

interface Props extends NativeStackScreenProps<RootStackParamList> { }

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [ country, setCountry ] = useState<CountriesAPI>();
  const { data } = useGetUserProfileQuery();

  const { data: countries } = useGetCountriesQuery();
  useEffect(() => {
    console.log("countries", countries);
    if (countries) {
      setCountry(countries.find((place) => place.name === data?.data.country));
    }
  }, [ countries, data?.data.country ]);
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      contentContainerClassName="bg-white flex-col justify-start items-start"
      keyboardShouldPersistTaps="handled"
    >
      <View className="w-full flex-row">
        <HeaderSide
          heading="My Profile"
          Icon={
            <TouchableOpacity
              onPress={() => navigation.navigate("SettingsScreen")}
              className="p-1 justify-center items-center bg-gray-200 rounded-full"
            >
              <MaterialIcons name="settings" color={"black"} size={25} />
            </TouchableOpacity>
          }
          isWithBack
        />
      </View>
      <View className="w-full justify-center items-center mt-6">
        <View className="relative">
          <FastImage
            style={{ width: 144, height: 144, borderRadius: 72 }}
            source={{
              uri: data?.data.profile_image,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View className="absolute bottom-2 right-4">
            <SecuredCheck
              width={30}
              height={30}
            />
          </View>
        </View>
        <AppText weight="light" className="text-center mt-2 text-xl">
          {data?.data.username}
        </AppText>
      </View>
      <View className="w-full px-4">
        <ActionRequired />
        <View className="w-full flex-row justify-between items-center mt-6">
          <View className="bg-gray-200 flex-1 mr-2 h-44 rounded-2xl p-5 justify-start">
            <AppText className="text-xl text-gray-500/60">Country</AppText>
            <View className="mt-4">
              <Image
                className="w-14 h-14 rounded-full"
                source={{
                  uri:
                    `https://flagcdn.com/w40/${country?.code.toLowerCase()}.png`,
                }}
              />
            </View>
          </View>
          <View className="bg-gray-200 flex-1 ml-2 h-44 rounded-2xl p-5 justify-start">
            <AppText className="text-xl text-gray-500/60">
              Local Currency
            </AppText>
            <AppText className="mt-4 text-2xl">
              {country?.currency.code}
            </AppText>
          </View>
        </View>
        <View className="w-full bg-gray-200 py-2 px-4 mt-6 rounded-2xl">
          <AppText className="text-gray-500">Email Address</AppText>
          <AppText className="mt-2">
            {data?.data.email}
          </AppText>
        </View>
        <View className="w-full flex-row px-4 justify-between items-center mt-6 py-2 bg-gray-200 rounded-lg">
          <AppText className="text-gray-500">Phone Number</AppText>
          <FigureText>{data?.data.phone_number}</FigureText>
        </View>
        <View className="w-full flex-row px-4 justify-between items-center mt-6 py-4 bg-gray-200 rounded-lg">
          <AppText className="text-gray-500">Verification Status</AppText>
          <StartKYC />
        </View>
      </View>
      <View className="mt-6">
        <BankingDetails text="Bank Accounts" />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
