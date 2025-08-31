import type React from "react";
import { View } from "react-native";

import AppText from "../typo/AppText";
import ActiveNetworkList from "./ActiveNetworkList";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";

const ActiveNetworks: React.FC = () => {
  return (
    <View className="flex-1 w-full justify-start mt-12 px-2 items-start">
      <AppText className="text-2xl mb-4">Active Network</AppText>
      <ActiveNetworkList />
      <View className="w-full py-3 bg-red-300/30 rounded-lg flex-row items-center mt-5 mb-10 text-center pl-3">
        <MaterialIcons name="warning" color="#FF0000" size={20} />
        <AppText
          weight="regular"
          className="text-[#FF0000] text-md w-full ml-3"
        >
          Any other usdc blockchain is not supported.
        </AppText>
      </View>
    </View>
  );
};

export default ActiveNetworks;
