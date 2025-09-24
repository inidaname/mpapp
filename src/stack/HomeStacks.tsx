import React from "react";

import { View } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import HomeSendScreen from "../screens/HomeSendScreen";

import HomeReceiveScreen from "../screens/HomeReceiveScreen";

import { HomeStackParams, RootStackParamList } from "../types/types";
import HeaderComponent from "../components/layouts/HeaderComponent";

interface Props extends NativeStackScreenProps<RootStackParamList, "Home"> {}

const HomeStack = createMaterialTopTabNavigator<HomeStackParams>();

const HomeStackTabs: React.FC<Props> = () => {
  return (
    <View className="flex-1 bg-white">
      <HeaderComponent />
      <HomeStack.Navigator className="flex-1 bg-gray-900">
        <HomeStack.Screen name="Send" component={HomeSendScreen} />
        <HomeStack.Screen name="Revceive" component={HomeReceiveScreen} />
      </HomeStack.Navigator>
    </View>
  );
};

export default HomeStackTabs;
