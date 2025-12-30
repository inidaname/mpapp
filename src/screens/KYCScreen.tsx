/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";
import { FullNavStack } from "../types/types";
import { useGetKYCQuery } from "../service/endpoints/kyc-endpoints";
import { PermissionsAndroid, Platform } from 'react-native';

interface Props extends NativeStackScreenProps<FullNavStack, "KYCScreen"> { }

const KycScreen: React.FC<Props> = ({ route, navigation }) => {
  const { kycLink, tosLink } = route.params;
  const { refetch } = useGetKYCQuery();
  const [ currentUrl, setCurrentUrl ] = useState(tosLink);
  // const [ phase, setPhase ] = useState<"tos" | "kyc">("tos");


  // Inside your component or a useEffect
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "KYC needs access to your camera to verify your identity.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Camera permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleMessage = async (event: any) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data);

      if (payload.event === "TOS_COMPLETED") {
        await refetch().unwrap();
        // setPhase("kyc");
        setCurrentUrl(kycLink);
      }

      if (payload.event === "KYC_COMPLETED") {
        await refetch().unwrap();
        navigation.goBack();
      }
    } catch (e) {
      console.warn("Invalid message from WebView", e);
      navigation.goBack();
    }
  };


  // const handleNavigationStateChange = async (navState: { url: string }) => {
  //   const { url } = navState;

  //   if (phase === "tos" && url.startsWith("https://kyc.insfers.com/")) {
  //     await refetch().unwrap();
  //     setPhase("kyc");
  //     setCurrentUrl(kycLink);
  //   }

  //   if (phase === "kyc" && url.startsWith("https://kyc.insfers.com")) {
  //     if (data?.data?.metadata?.kyc?.tos_status !== "approved") {
  //       navigation.goBack();
  //     }
  //   }
  // };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: currentUrl }}
        onMessage={handleMessage}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator style={{ flex: 1 }} size="large" />
        )}
        originWhitelist={[ "*" ]}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
      />
    </View>
  );
};

export default KycScreen;
