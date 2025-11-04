import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";
import { FullNavStack } from "../types/types";

interface Props extends NativeStackScreenProps<FullNavStack, "KYCScreen"> {}

const KycScreen: React.FC<Props> = ({ route, navigation }) => {
  const { kycLink } = route.params;

  console.log("kycLink", kycLink);
  const handleNavigationStateChange = (navState: { url: any }) => {
    const { url } = navState;

    if (url.startsWith("https://example.com")) {
      // Replace this with your actual redirect or deep link
      navigation.replace("MainStack"); // Or navigate somewhere else
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: kycLink }}
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
