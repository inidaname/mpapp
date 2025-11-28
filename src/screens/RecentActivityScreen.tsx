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
  </View>
);

export default RecentActivitiesScreen;
