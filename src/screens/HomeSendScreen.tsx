import React, { useState } from "react";

import { TouchableOpacity, View } from "react-native";
import AppText from "../components/typo/AppText";
import CheckBox from "@react-native-community/checkbox";
import USDC from "../../assets/Web3Icons/usdc_logo.svg";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

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
        onPress={() => navigation.navigate("Home")}
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
  return (
    <>
      <View className="bg-white flex-1">
        {/* Balance */}
        <View className="items-center mt-6">
          <AppText className="text-gray-500">Total Balance in USDC</AppText>
          <View className="flex-row items-center mt-4">
            <USDC width={30} height={30} />
            <AppText className="text-4xl font-bold ml-2 w-40">
              {balanceHidden ? "••••.••" : "2,803.12"}
            </AppText>
          </View>
          <TouchableOpacity onPress={() => setBalanceHidden(!balanceHidden)}>
            <AppText className="text-blue-600 mt-2">
              {balanceHidden ? "Show Balance" : "Hide Balance"}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Send Form */}
        <View className="mt-8 px-6">
          {/* Send To */}
          <View className="flex-row items-center justify-between border-b border-gray-100 pb-2">
            <AppText>Send To</AppText>
            <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full">
              <AppText className="text-white font-semibold">Scan</AppText>
            </TouchableOpacity>
          </View>

          {/* Amount */}
          <View className="flex-row items-center justify-between border-b border-gray-100 mt-10 pb-2">
            <AppText>Amount</AppText>
            <View className="flex-row items-center">
              <View className="h-6 w-6 p-1 mr-2 border border-brand-700 rounded-full items-center justify-center">
                <View className="h-4 w-4 bg-brand-700 rounded-full" />
              </View>
              <AppText className="text-gray-500">USDC</AppText>
            </View>
          </View>

          {/* Checkbox */}
          <View className="flex-row items-center justify-center mt-10">
            {
              /* <Checkbox
              value={feesSeparate}
              onValueChange={setFeesSeparate}
              color={feesSeparate ? "#2563eb" : undefined}
            /> */
            }
            <CheckBox />
            <AppText className="ml-2 text-brand-700 text-lg">
              Detect fees separately
            </AppText>
          </View>

          {/* Send button */}
          <TouchableOpacity className="mt-24 bg-blue-600 p-4 w-2/3 self-center rounded-2xl">
            <AppText className="text-center text-white font-bold text-lg">
              Send
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
      <CustomTabBar navigation={navigation} route={route} />
    </>
  );
};

export default HomeSendScreen;
