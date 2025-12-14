import React, { useCallback } from "react";
import { Pressable, View } from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import AppText from "../typo/AppText";
import { FullNavStack } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../store/redux";
import {
  closeMenu,
  toggleMenu as menuState,
} from "../../store/reducers/menu-pop-slice";

export default function PopupMenu() {
  const navigate = useNavigation<NativeStackNavigationProp<FullNavStack>>();
  const dispatch = useAppDispatch();
  const { isMenuOpen } = useAppSelector((state) => state.memu);

  useFocusEffect(
    useCallback(() => {
      return () => closeMenu();
    }, []),
  );

  const toggleMenu = () => {
    dispatch(menuState());
  };

  return (
    <View className="z-10 ">
      {/* Trigger Button */}
      <Pressable
        className="bg-brand-100 p-2 rounded-full"
        onPress={toggleMenu}
      >
        <MaterialIcons name="more-horiz" size={30} color="#2563eb" />
      </Pressable>

      {/* Popup Menu */}
      {isMenuOpen && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          className="absolute top-14 right-0 w-60 bg-white rounded-xl shadow-2xl border border-gray-200"
        >
          <Pressable
            className="px-4 py-4 my-2 border-b border-gray-100 flex-row justify-between items-center"
            onPress={() => {
              toggleMenu();
              navigate.navigate("SendToBankScreen");
            }}
          >
            <AppText className="text-gray-800">Transfer To Bank</AppText>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ borderRadius: "50%" }}
              className="bg-[#14141480] w-8 h-8 rounded-full justify-center items-center"
            >
              <MaterialIcons name="north-east" color="white" />
            </View>
          </Pressable>

          <Pressable
            className="px-4 py-4 my-2 border-y border-gray-100 flex-row justify-between items-center"
            onPress={() => {
              toggleMenu();
              navigate.navigate("WalletScreen");
            }}
          >
            <AppText className="text-gray-800">Wallet Details</AppText>
            <View className="rounded-full justify-center items-center">
              <MaterialIcons
                name="credit-card"
                color="#14141480"
                size={25}
              />
            </View>
          </Pressable>
          <Pressable
            className="px-4 py-4 my-2 border-t border-gray-100 flex-row justify-between items-center"
            onPress={() => {
              toggleMenu();
              navigate.navigate("RecentActivitiesScreen");
            }}
          >
            <AppText className="text-gray-800">Notifications</AppText>
            <View className="rounded-full justify-center items-center">
              <MaterialIcons
                name="notifications"
                color="#14141480"
                size={25}
              />
            </View>
          </Pressable>
          <Pressable
            className="px-4 py-4 my-2 border-t border-gray-100 flex-row justify-between items-center"
            onPress={() => {
              toggleMenu();
              navigate.navigate("OfflinePaymentScreen");
            }}
          >
            <AppText className="text-gray-800">Make Offline Payment</AppText>
            <View className="rounded-full justify-center items-center">
              <MaterialIcons
                name="notifications"
                color="#14141480"
                size={25}
              />
            </View>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
