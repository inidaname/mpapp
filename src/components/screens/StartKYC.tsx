import React from "react";
import { TouchableOpacity, View } from "react-native";
import AppText from "../typo/AppText";
import {
  useGetKYCQuery,
  useStartKYCMutation,
} from "../../service/endpoints/kyc-endpoints";
import { useNavigation } from "@react-navigation/native";
import { KYCScreenNavigationProp } from "../../types/types";

interface Props {
  text?: string;
}

const StartKYC: React.FC<Props> = ({ text }) => {
  const [ startKYC, { isLoading } ] = useStartKYCMutation();
  const { data, isLoading: gettingKYC } = useGetKYCQuery();
  const navigation = useNavigation<KYCScreenNavigationProp>();

  const handleKYC = async () => {
    try {
      const kyc = await startKYC().unwrap();
      console.log("kyc", kyc);

      const { data: { metadata: { kyc: { tos_status, kyc_status } } } } = kyc;
      const kycLink = kyc.data.metadata?.kyc?.kyc_link;
      const tosLink = kyc.data.metadata?.kyc?.tos_link;

      if (kycLink && (tos_status !== "approved" || kyc_status !== "approved")) {
        navigation.navigate("KYCScreen", { kycLink, tosLink });
      } else {
        console.log("No KYC link found");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  if (data?.data.metadata.kyc.kyc_status === "approved") {
    return <AppText className="text-green-800 font-bold">KYC Verified</AppText>;
  }

  return (
    <View className="flex-row">
      {
        /* <AppText className="text-red-600 font-medium mr-2">
        {{
          not_started: "KYC Not Started",
          pending: "KYC Pending",
          approved: "KYC Approved",
        }[data?.data.status!]}
      </AppText> */
      }
      <TouchableOpacity
        className="ml-2"
        onPress={handleKYC}
        disabled={isLoading || gettingKYC}
      >
        <AppText
          weight="bold"
          className={`${isLoading || gettingKYC ? "text-gray-400" : "text-red-700"
            } text-sm`}
        >
          {text ? text : "Complete KYC Verification"}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export default StartKYC;
