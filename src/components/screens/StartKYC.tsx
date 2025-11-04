import React from "react";
import { TouchableOpacity, View } from "react-native";
import AppText from "../typo/AppText";
import {
  useGetKYCQuery,
  useStartKYCMutation,
} from "../../service/endpoints/kyc-endpoints";
import { useNavigation } from "@react-navigation/native";
import { KYCScreenNavigationProp } from "../../types/types";

const StartKYC: React.FC = () => {
  const [startKYC, { isLoading }] = useStartKYCMutation();
  const { data, isLoading: gettingKYC } = useGetKYCQuery();
  const navigation = useNavigation<KYCScreenNavigationProp>();

  const handleKYC = async () => {
    try {
      const kyc = await startKYC().unwrap();
      console.log("kyc", kyc);
      const kycLink = kyc.data.metadata?.kyc?.kyc_link;

      if (kycLink) {
        navigation.navigate("KYCScreen", { kycLink });
      } else {
        console.log("No KYC link found");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  if (data?.data.metadata.kyc.kyc_status === "approved") {
    return <AppText className="text-green-800 font-bold">Verified</AppText>;
  }

  return (
    <View className="flex-row">
      <AppText className="text-red-600 font-thin mr-2">
        Pending Verification
      </AppText>
      <TouchableOpacity
        className="ml-2"
        onPress={handleKYC}
        disabled={isLoading || gettingKYC}
      >
        <AppText
          weight="bold"
          className={`${
            isLoading || gettingKYC ? "text-gray-400" : "text-brand-700"
          } text-sm`}
        >
          Start KYC
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export default StartKYC;
