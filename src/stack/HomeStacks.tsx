import React from "react";

import { Pressable, View } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import HomeSendScreen from "../screens/HomeSendScreen";

import HomeReceiveScreen from "../screens/HomeReceiveScreen";

import { HomeStackParams, RootStackParamList } from "../types/types";
import HeaderComponent from "../components/layouts/HeaderComponent";
import { useAppDispatch, useAppSelector } from "../store/redux";
import { closeMenu } from "../store/reducers/menu-pop-slice";

interface Props extends NativeStackScreenProps<RootStackParamList, "Home"> {}

const HomeStack = createMaterialTopTabNavigator<HomeStackParams>();

const HomeStackTabs: React.FC<Props> = () => {
  const { isMenuOpen } = useAppSelector((state) => state.memu);
  const dispatch = useAppDispatch();

  return (
    <View className="flex-1 bg-white gap-10">
      <HeaderComponent />
      <HomeStack.Navigator className="flex-1 bg-gray-900">
        <HomeStack.Screen
          name="Send"
          options={{
            tabBarActiveTintColor: "#437DFF",
            tabBarInactiveTintColor: "#14141480",
            tabBarLabelStyle: { fontSize: 18 },
          }}
          component={HomeSendScreen}
        />
        <HomeStack.Screen
          name="Receive"
          options={{
            tabBarActiveTintColor: "#437DFF",
            tabBarInactiveTintColor: "#14141480",
            tabBarLabelStyle: { fontSize: 18 },
          }}
          component={HomeReceiveScreen}
        />
      </HomeStack.Navigator>
      {isMenuOpen && (
        <Pressable
          className="absolute top-0 left-0 right-0 bottom-0 z-[999] bg-black/20"
          onPress={() => {
            dispatch(closeMenu());
          }}
        />
      )}
    </View>
  );
};

export default HomeStackTabs;
