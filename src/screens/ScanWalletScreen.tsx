import React, { useEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";

type Props = NativeStackScreenProps<FullNavStack>;

export default function ScanWalletScreen({ navigation }: Props) {
  const device = useCameraDevice("back");

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      if (status !== "granted") {
        Alert.alert("Camera permission denied");
        navigation.goBack();
      }
    })();
  }, [navigation]);

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        const qrValue = codes[0].value || "";
        navigation.navigate("Home", {
          screen: "Send",
          params: { wallet_address: qrValue },
        });
      }
    },
  });

  if (!device) return null;

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      codeScanner={codeScanner}
    />
  );
}
