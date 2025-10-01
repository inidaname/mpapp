import React, { useEffect, useRef } from "react";
import { Animated, Image, TouchableOpacity, View } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { BleManager } from "react-native-ble-plx";

import AppText from "../components/typo/AppText";
import HeaderSide from "../components/Main/HeaderSide";
import MaterialIcons from "@react-native-vector-icons/material-icons";

const users = [
  { id: 1, name: "John", avatar: "https://i.pravatar.cc/100?img=1" },
  { id: 2, name: "Maria Gomez", avatar: "https://i.pravatar.cc/100?img=2" },
  { id: 3, name: "Alex", avatar: "https://i.pravatar.cc/100?img=3" },
];

export default function NearbyUsersScreen() {
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim3 = useRef(new Animated.Value(0)).current;

  const startPulse = (anim: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 2000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  useEffect(() => {
    startPulse(pulseAnim1, 0);
    startPulse(pulseAnim2, 600);
    startPulse(pulseAnim3, 1200);
  }, [pulseAnim1, pulseAnim2, pulseAnim3]);

  // eslint-disable-next-line react/no-unstable-nested-components
  const Ring = ({ anim, color }: { anim: Animated.Value; color: string }) => {
    const scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 2.5],
    });
    const opacity = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    });

    return (
      <Animated.View
        style={{
          transform: [{ scale }],
          opacity,
        }}
        className={`absolute w-64 h-64 rounded-full ${color}`}
      />
    );
  };

  return (
    <View className="flex-1 bg-white items-center justify-between">
      <HeaderSide heading="Search Nearby Users" isWithBack />
      <View className="items-center justify-center">
        <Ring anim={pulseAnim1} color="bg-blue-500" />
        <Ring anim={pulseAnim2} color="bg-gray-300" />
        <Ring anim={pulseAnim3} color="bg-gray-200" />

        {/* Central button */}
        <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center">
          <MaterialIcons name="sensors" size={40} color={"white"} />
        </View>
      </View>

      {/* Nearby Avatars */}
      <View className="absolute w-full h-1/2 top-44 items-center justify-center">
        <View className="absolute top-20 left-10">
          <Image
            source={{ uri: users[0].avatar }}
            className="w-12 h-12 rounded-full"
          />
        </View>
        <View className="absolute top-20 right-10">
          <Image
            source={{ uri: users[1].avatar }}
            className="w-12 h-12 rounded-full"
          />
        </View>
        <View className="absolute bottom-20 right-20">
          <Image
            source={{ uri: users[2].avatar }}
            className="w-12 h-12 rounded-full"
          />
        </View>
      </View>

      {/* Bottom Card */}
      <View className="bottom-8 w-11/12 bg-gray-100 p-4 rounded-xl">
        <AppText className="font-bold text-base mb-2">Nearby Users</AppText>
        <View className="flex-row items-center justify-between bg-white p-3 rounded-lg shadow">
          <AppText className="font-medium">Maria Gomez</AppText>
          <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg">
            <AppText className="text-white">Select</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
