/* eslint-disable react-native/no-inline-styles */
import React from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/types";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import HeaderSide from "../components/Main/HeaderSide";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import AppText, { FigureText } from "../components/typo/AppText";
import SecuredCheck from "../../assets/green_check.svg";
import BankingDetails from "../components/Main/BankingDetails";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
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
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            className="w-44 h-44 rounded-full"
          />
          <View className="absolute bottom-2 right-4">
            <SecuredCheck
              width={30}
              height={30}
            />
          </View>
        </View>
        <AppText weight="light" className="text-center mt-2 text-xl">
          mariagomez1234567
        </AppText>
      </View>
      <View className="w-full px-4">
        <View className="w-full flex-row items-start justify-start bg-gray-200 h-44 mt-6 rounded-2xl p-4">
          <View className="bg-red-600 rounded-full items-center justify-center h-10 w-10">
            <MaterialIcons name="priority-high" size={20} color="white" />
          </View>
          <View className="ml-4 flex-1">
            <AppText weight="bold" className="text-xl">Action Required</AppText>
            <AppText className="text-gray-500 mt-2">
              Your account is not verified yet please add your personal details
              to verify
            </AppText>
          </View>
        </View>
        <View className="w-full flex-row justify-between items-center mt-6">
          <View className="bg-gray-200 flex-1 mr-2 h-44 rounded-2xl" />
          <View className="bg-gray-200 flex-1 ml-2 h-44 rounded-2xl" />
        </View>
        <View className="w-full bg-gray-200 py-2 px-4 mt-6 rounded-2xl">
          <AppText className="text-gray-500">Email Address</AppText>
          <AppText className="mt-2">mariagomez123@gmail.com</AppText>
        </View>
        <View className="w-full flex-row px-4 justify-between items-center mt-6 py-2 bg-gray-200 rounded-lg">
          <AppText className="text-gray-500">Phone Number</AppText>
          <FigureText>+92345678901</FigureText>
        </View>
        <View className="w-full flex-row px-4 justify-between items-center mt-6 py-4 bg-gray-200 rounded-lg">
          <AppText className="text-gray-500">Verification Status</AppText>
          <AppText className="text-green-600 font-thin">Verified</AppText>
        </View>
      </View>
      <View className="mt-6">
        <BankingDetails text="Bank Accounts" />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
