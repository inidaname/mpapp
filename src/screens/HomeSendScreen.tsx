/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";

import { TouchableOpacity, View } from "react-native";
import AppText from "../components/typo/AppText";
import USDC from "../../assets/Web3Icons/usdc_logo.svg";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";
import { useAppSelector } from "../store/redux";
import { useCameraPermission } from "react-native-vision-camera";
import SendComponent from "../components/Main/SendComponent";
import { useGetWalletByIdQuery } from "../service/endpoints/wallets-endpoints";

interface Props extends NativeStackScreenProps<FullNavStack, "Send"> {}

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
  const { hasPermission, requestPermission } = useCameraPermission();
  const { active_wallet } = useAppSelector((state) => state.wallet);

  const { data } = useGetWalletByIdQuery(active_wallet?.id ?? "");

  useEffect(() => {
    const handleRequest = async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    };

    handleRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPermission]);
  return (
    <>
      <View className="bg-white flex-1">
        {/* Balance */}
        <View className="items-center mt-6">
          <AppText className="text-gray-500">Total Balance in USDC</AppText>
          <View className="flex-row items-center justify-center mt-4">
            <USDC width={30} height={30} />
            <AppText className="text-4xl text-center font-bold ml-2 w-auto">
              {balanceHidden
                ? "••••.••"
                : Number(data?.data.circle.data.tokenBalances[1].amount ?? 0)}
            </AppText>
          </View>
          <TouchableOpacity onPress={() => setBalanceHidden(!balanceHidden)}>
            <AppText className="text-blue-600 mt-2">
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
    </>
  );
};

export default HomeSendScreen;
