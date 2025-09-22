import React from "react";

import { Image, TouchableOpacity, View } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import HomeSendScreen from "../screens/HomeSendScreen";
import AppText from "../components/typo/AppText";
import MenuPopover from "../components/utils/MenuPopOver";
import HomeReceiveScreen from "../screens/HomeReceiveScreen";

import { HomeStackParams, RootStackParamList } from "../types/types";

interface Props extends NativeStackScreenProps<RootStackParamList, "Home"> {}

const HomeStack = createMaterialTopTabNavigator<HomeStackParams>();

const HomeStackTabs: React.FC<Props> = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 pt-12">
        <View className="flex-row items-center">
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            className="w-12 h-12 rounded-full"
          />
          <AppText className="ml-3 text-brand-600 font-semibold">
            @codecrafter21
          </AppText>
        </View>
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity className="p-2 rounded-full">
            <Image source={require("../../assets/blue_sphare.png")} />
          </TouchableOpacity>
          <MenuPopover />
        </View>
      </View>
      <HomeStack.Navigator className="flex-1 bg-gray-900">
        <HomeStack.Screen name="Send" component={HomeSendScreen} />
        <HomeStack.Screen name="Revceive" component={HomeReceiveScreen} />
      </HomeStack.Navigator>
    </View>
  );
};

export default HomeStackTabs;
