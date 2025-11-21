import React from "react";

import { View } from "react-native";
// import InsfersLogo from "../../assets/Insfers_Logo.svg";
import HeaderSide from "../components/Main/HeaderSide";
import RecentActivities from "../components/screens/RecentActivitiies";
// import { MaterialIcons } from "@react-native-vector-icons/material-icons";

const RecentActivitiesScreen: React.FC = () => (
  <View className="flex-1 bg-white">
    <HeaderSide heading="Recent Activities" isWithBack />

    <RecentActivities />
    {
      /* <View className="px-6">
        <View className="flex-row w-full p-4">
          <View className="h-14 w-14 items-center justify-center rounded-full">
            <InsfersLogo width={40} height={40} />
          </View>
          <View className="w-full ml-5 pr-5">
            <AppText weight="bold" className="text-xl">
              Welcome To Insfers
            </AppText>
            <AppText>
              Experience secure and stable transactions powered by USD Coin
              (USDC).
            </AppText>
          </View>
        </View>
        <View className="flex-row w-full p-4">
          <View className="h-14 w-14 items-center justify-center bg-gray-200 rounded-full">
            <MaterialIcons name="south-west" size={30} color={"#215CE1"} />
          </View>
          <View className="w-full ml-5 pr-5">
            <AppText weight="bold" className="text-xl">
              USDC Received
            </AppText>
            <AppText>
              You have received 150 USDC from Alex Johnson. View details
            </AppText>
          </View>
        </View>
        <View className="flex-row w-full p-4">
          <View className="h-14 w-14 items-center justify-center bg-gray-200 rounded-full">
            <MaterialIcons name="north-east" size={30} color={"#215CE1"} />
          </View>
          <View className="w-full ml-5 pr-5">
            <AppText weight="bold" className="text-xl">
              Payment Sent
            </AppText>
            <AppText>
              You have succesfully sent payment of 75 USDC to Eva Martinez .
            </AppText>
          </View>
        </View>
        <View className="flex-row w-full p-4">
          <View className="h-14 w-14 items-center justify-center bg-gray-200 rounded-full">
            <MaterialIcons name="receipt" size={30} color={"#215CE1"} />
          </View>
          <View className="w-full ml-5 pr-5">
            <AppText weight="bold" className="text-xl">
              Monthly Account Summary
            </AppText>
            <AppText>
              Your account summary for October is ready. Check your email for
              details.
            </AppText>
          </View>
        </View>
      </View> */
    }
  </View>
);

export default RecentActivitiesScreen;
