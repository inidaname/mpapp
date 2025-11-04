import React from "react";
import { TouchableOpacity } from "react-native";
import AppText from "../typo/AppText";
import { useStartKYCMutation } from "../../service/endpoints/kyc-endpoints";
import { useNavigation } from "@react-navigation/native";
import { KYCScreenNavigationProp } from "../../types/types";

const StartKYC: React.FC = () => {
  const [startKYC, { isLoading }] = useStartKYCMutation();
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

  return (
    <TouchableOpacity className="ml-2" onPress={handleKYC} disabled={isLoading}>
      <AppText
        weight="bold"
        className={`${isLoading ? "text-gray-400" : "text-brand-700"} text-sm`}
      >
        Start KYC
      </AppText>
    </TouchableOpacity>
  );
};

export default StartKYC;
