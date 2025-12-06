/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";
import { FullNavStack } from "../types/types";
import { useGetKYCQuery } from "../service/endpoints/kyc-endpoints";

interface Props extends NativeStackScreenProps<FullNavStack, "KYCScreen"> {}

const KycScreen: React.FC<Props> = ({ route, navigation }) => {
  const { kycLink, tosLink } = route.params;
  const { data, refetch } = useGetKYCQuery();
  const [currentUrl, setCurrentUrl] = useState(tosLink);
  const [phase, setPhase] = useState<"tos" | "kyc">("tos");

  const handleNavigationStateChange = async (navState: { url: string }) => {
    const { url } = navState;

    if (phase === "tos" && url.startsWith("https://kyc.insfers.com/agreed")) {
      await refetch().unwrap();
      setPhase("kyc");
      setCurrentUrl(kycLink);
    }

    if (phase === "kyc" && url.startsWith("https://kyc.insfers.com")) {
      if (data?.data?.metadata?.kyc?.tos_status !== "approved") {
        navigation.goBack();
      } else {
        navigation.replace("KycStatus");
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: currentUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator style={{ flex: 1 }} size="large" />
        )}
      />
    </View>
  );
};

export default KycScreen;
