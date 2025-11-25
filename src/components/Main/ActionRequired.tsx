import MaterialIcons from "@react-native-vector-icons/material-icons";
import React from "react";
import { View } from "react-native";
import AppText from "../typo/AppText";
import { useGetKYCQuery } from "../../service/endpoints/kyc-endpoints";

const ActionRequired: React.FC = () => {
  const { data, isLoading, isError, error } = useGetKYCQuery();

  console.log("error", error);

  if (data?.data.metadata.kyc.kyc_status === "approved" || isLoading) {
    return null;
  }

  return (
    <View className="w-full flex-row items-start justify-start bg-gray-200 h-44 mt-6 rounded-2xl p-4">
      <View className="bg-red-600 rounded-full items-center justify-center h-10 w-10">
        <MaterialIcons name="priority-high" size={20} color="white" />
      </View>
      <View className="ml-4 flex-1">
        <AppText weight="bold" className="text-xl">Action Required</AppText>
        <AppText className="text-gray-500 mt-2">
          {isError
            ? "Problem confirming your verification"
            : "Your account is not verified yet please add your personal details to verify"}
        </AppText>
      </View>
    </View>
  );
};

export default ActionRequired;
