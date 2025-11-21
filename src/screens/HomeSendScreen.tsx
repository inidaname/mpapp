/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";

import { Image, Text, TouchableOpacity, View } from "react-native";
import AppText from "../components/typo/AppText";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";
import { useAppSelector } from "../store/redux";
import SendComponent from "../components/Main/SendComponent";
import { useAddDeviceNotyMutation } from "../service/endpoints/notification-endpoints";
import messaging from "@react-native-firebase/messaging";
import { useGetWalletByIdQuery } from "../service/endpoints/wallets-endpoints";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface Props extends NativeStackScreenProps<FullNavStack, "Send"> {}

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();

  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

const CustomTabBar: React.FC<Props> = ({ navigation }) => {
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

const HomeSendScreen: React.FC<Props> = ({ navigation, route }) => {
  const [balanceHidden, setBalanceHidden] = useState(false);
  // const [hasPermission, setHasPermission] = useState(false);
  const { active_wallet } = useAppSelector((state) => state.wallet);

  const { data } = useGetWalletByIdQuery(active_wallet?.id ?? "");

  const [addDevice] = useAddDeviceNotyMutation();

  // useEffect(() => {
  //   const handleRequest = async () => {
  //     if (!hasPermission) {
  //       await requestUserPermission();
  //       setHasPermission(true)

  //     }
  //   };

  //   handleRequest();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [hasPermission]);

  useEffect(() => {
    (async () => {
      const getPermission = await requestUserPermission();
      console.log("hasPermission", getPermission);
      if (getPermission) {
        const deviceToken = await messaging().getToken();
        console.log("deviceToken", deviceToken);

        const deviceReady = await addDevice({
          deviceToken,
          device: "Hassan",
        }).unwrap();
        console.log("deviceReady", deviceReady);
      } else {
        console.log("Permission denied", "Notifications won’t work.");
      }

      // Listen for token refresh
      return messaging().onTokenRefresh(async (newToken) => {
        console.log("FCM Token refreshed:", newToken);
        const deviceReady = await addDevice({
          deviceToken: newToken,
          device: "Hassan",
        }).unwrap();
        console.log("deviceReady", deviceReady);
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Foreground message handler
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log(
        "New Notification",
        JSON.parse(remoteMessage.notification?.body ?? ""),
      );
    });
    return unsubscribe;
  }, []);

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
              {balanceHidden ? "••••.••" : Number(
                data?.data?.circle?.data?.tokenBalances[0]?.amount ?? 0,
              ).toPrecision(
                !data?.data.circle.data.tokenBalances[0]?.token.decimals ||
                  data?.data.circle.data.tokenBalances[0]?.token.decimals > 3
                  ? 3
                  : data?.data.circle.data.tokenBalances[0]?.token.decimals,
              )}
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
          route={route}
          wallet={data?.data.circle.data.tokenBalances ?? []}
        />
      </View>
      <CustomTabBar navigation={navigation} route={route} />
    </KeyboardAwareScrollView>
  );
};

export default HomeSendScreen;
