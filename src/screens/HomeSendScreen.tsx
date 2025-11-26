/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import messaging from "@react-native-firebase/messaging";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppText from "../components/typo/AppText";
import { FullNavStack } from "../types/types";
import { useAppSelector } from "../store/redux";
import SendComponent from "../components/Main/SendComponent";
import { useAddDeviceNotyMutation } from "../service/endpoints/notification-endpoints";
import { useGetWalletByIdQuery } from "../service/endpoints/wallets-endpoints";
import { selectUSDC } from "../helpers/select_usdc";
// import { FIREBASE_APP } from "../utils/app-notifier";

interface Props extends NativeStackScreenProps<FullNavStack, "Send"> {}

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  console.log("authStatus", authStatus);

  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

const CustomTabBar: React.FC<Pick<Props, "navigation">> = ({ navigation }) => {
  const DIP_WIDTH = 140;
  const DIP_HEIGHT = 56;
  const FAB_SIZE = 64;

  return (
    <View className="relative">
      {/* Bottom bar row */}
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

const HomeSendScreen: React.FC<Props> = ({ navigation }) => {
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const { active_wallet } = useAppSelector((state) => state.wallet);

  const { data, isLoading } = useGetWalletByIdQuery(
    active_wallet?.id ?? "",
  );

  const [addDevice] = useAddDeviceNotyMutation();

  const initializeNotifications = useCallback(async () => {
    const allowed = await requestUserPermission();
    if (!allowed) return;

    const token = await messaging().getToken();
    await addDevice({
      deviceToken: token,
      device: active_wallet?.user_id ?? "",
    });

    return messaging().onTokenRefresh(async (newToken) => {
      await addDevice({
        deviceToken: newToken,
        device: active_wallet?.user_id ?? "",
      });
    });
  }, [active_wallet?.user_id, addDevice]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // Logic:
      // 1. If isConnected is false -> DEFINITELY OFFLINE
      // 2. If isConnected is true BUT isInternetReachable is explicitly false -> OFFLINE
      // 3. If isInternetReachable is null (detecting), assume ONLINE for now.

      const offline = state.isConnected === false ||
        (state.isConnected === true && state.isInternetReachable === false);

      setIsOffline(offline);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    initializeNotifications();
  }, [initializeNotifications]);

  const usdc = selectUSDC(data?.data);
  const formattedBalance = usdc
    ? Number(usdc?.amount).toPrecision(
      !usdc.token.decimals || usdc.token.decimals > 3 ? 3 : usdc.token.decimals,
    )
    : "0.00";

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={40}
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
              {isLoading || isOffline
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
          token_id={usdc?.token?.id ?? ""}
        />
      </View>
      <CustomTabBar navigation={navigation} />
    </KeyboardAwareScrollView>
  );
};

export default HomeSendScreen;
