/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppText from "../components/typo/AppText";
import { FullNavStack } from "../types/types";
import { useAppSelector } from "../store/redux";
import SendComponent from "../components/Main/SendComponent";
import { useRefreshUserAndWallet } from "../hooks/useRefreshProfileAndWallet";

interface Props extends NativeStackScreenProps<FullNavStack, "Send"> {}

const CustomTabBar: React.FC<Pick<Props, "navigation">> = ({ navigation }) => {
  const DIP_WIDTH = 140;
  const DIP_HEIGHT = 56;
  const FAB_SIZE = 64;

  return (
    <View className="relative">
      {/* Bottom bar row */}

<Pressable
  onPress={() => {
    navigation.navigate("OfflinePaymentScreen")
  }}
  className="
    absolute
    bottom-24
    left-6
    w-16
    h-16
    bg-brand-700
    rounded-2xl
    items-center
    justify-center
    shadow-lg
  "
  style={{
    shadowColor: "#beb7b796",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  }}
>
<MaterialIcons name="wifi-off" color="white" size={24} />
</Pressable>
      <View className="flex-row h-20 w-full items-center justify-between px-10 bg-gray-100">
        <TouchableOpacity
          className="items-center w-1/3"
          onPress={() => navigation.navigate("RecentActivitiesScreen")}
        >
          <MaterialIcons name="timeline" size={22} color="gray" />
          <AppText className="text-gray-500 text-xs mt-1">
            Recent Activities
          </AppText>
        </TouchableOpacity>

        {/* spacer keeps left/right buttons spaced evenly (center is taken by the concave shape) */}
        <View style={{ width: DIP_WIDTH }} />

        <TouchableOpacity
          className="items-center w-1/3"
          onPress={() => navigation.navigate("AddUserScreen")}
        >
          <MaterialIcons name="person-add" size={22} color="gray" />
          <AppText className="text-gray-500 text-xs mt-1">Add User</AppText>
        </TouchableOpacity>
      </View>

      {/* White concave shape (absolute, centered) */}
      <View
        style={{
          position: "absolute",
          alignSelf: "center",
          bottom: 20,
          width: DIP_WIDTH,
          height: DIP_HEIGHT,
          borderBottomLeftRadius: DIP_WIDTH / 2,
          borderBottomRightRadius: DIP_WIDTH / 2,
          backgroundColor: "#ffffff",
          zIndex: 1,
          elevation: 1, // android stacking
        }}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("ConversionScreen")}
        style={{
          position: "absolute",
          alignSelf: "center",
          // put the FAB so it sits inside the concave dip — tweak as needed:
          bottom: DIP_HEIGHT - FAB_SIZE / 2 + 20,
          width: FAB_SIZE,
          height: FAB_SIZE,
          borderRadius: FAB_SIZE / 2,
          backgroundColor: "#2563EB",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          elevation: 6,
        }}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const HomeSendScreen: React.FC<Props> = ({ navigation, route }) => {
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { refreshing, onRefresh } = useRefreshUserAndWallet();
  const { usdcWallet } = useAppSelector((state) => state.USDCWallet);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = state.isConnected === false ||
        (state.isConnected === true && state.isInternetReachable === false);

      setIsOffline(offline);
    });

    return () => unsubscribe();
  }, []);

  const formattedBalance = Number(usdcWallet?.amount ?? 0).toFixed(2);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={40}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-white flex-1">
          {/* Balance */}
          <View className="items-center mt-6">
            <AppText className="text-gray-500 text-[14px]">
              Total Balance in USDC
            </AppText>
            <View className="flex-row items-center justify-center mt-1">
              <Image
                source={require("../../assets/USDC.png")}
                width={200}
                height={200}
              />
              <Text className="text-[47px] font-montserrat-medium text-center ml-2 w-auto">
                {isOffline
                  ? <ActivityIndicator size="small" color="blue" />
                  : balanceHidden
                  ? "••••.••"
                  : formattedBalance}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setBalanceHidden(!balanceHidden)}>
              <AppText className="text-blue-600 mt-2 text-[18px]">
                {balanceHidden ? "Show Balance" : "Hide Balance"}
              </AppText>
            </TouchableOpacity>
          </View>

          <SendComponent
            navigation={navigation}
            token_id={usdcWallet?.token?.id ?? ""}
            wallet_balance={usdcWallet?.amount ?? ""}
            route={route}
          />
        </View>
        <CustomTabBar navigation={navigation} />
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default HomeSendScreen;
