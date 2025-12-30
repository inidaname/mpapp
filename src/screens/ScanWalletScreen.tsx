/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";
import { useAppDispatch } from "../store/redux";
import {
  clearScannedAddress,
  setScanned,
  setScannedAddress,
} from "../store/reducers/scan-wallet-slice";
import AppText from "../components/typo/AppText";

type Props = NativeStackScreenProps<FullNavStack, "ScanWalletScreen">;

export default function ScanWalletScreen({ navigation, route }: Props) {
  const [ hasPermission, setHasPermission ] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearScannedAddress());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();

      if (status === "granted") {
        setHasPermission(true);
        return;
      }

      // If denied but requestable
      if (status === "denied" || status === "not-determined") {
        Alert.alert(
          "Camera Permission Needed",
          "You must allow camera permission to scan QR codes.",
          [
            {
              text: "Try Again",
              onPress: async () => {
                const retry = await Camera.requestCameraPermission();
                if (retry === "granted") {
                  setHasPermission(true);
                } else {
                  navigation.goBack();
                }
              },
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => navigation.goBack(),
            },
          ],
        );
        return;
      }

      // Restricted or weird edge states
      Alert.alert(
        "Camera Unavailable",
        "Your device does not allow camera access.",
        [ { text: "OK", onPress: () => navigation.goBack() } ],
      );
    })();
  }, [ navigation ]);

  const device = useCameraDevice("back");

  const codeScanner = useCodeScanner({
    codeTypes: [ "qr" ],
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        const qr = codes[ 0 ].value || "";
        // navigation.navigate("Home", {
        //   screen: "Send",
        //   params: { wallet_address: qr },
        // });
        dispatch(setScannedAddress(qr));
        dispatch(setScanned(true));
        handleNavigation(qr)
      }
    },
  });

  const handleNavigation = (qr?: string) => {
    if (route.params?.from === "HomeSendScreen") {
      navigation.replace("Home", {
        screen: "Send",
        params: { wallet_address: qr },
      });
    } else {
      navigation.replace(route.params?.from)
    }
  }

  if (!device) {
    return (
      <View className="flex-1 justify-center items-center">
        <AppText>Camera not available</AppText>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View className="flex-1 justify-center items-center">
        <AppText>Waiting for permission...</AppText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />

      {/* Title row */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => { handleNavigation() }}>
          <Text style={styles.back}>×</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Scan QR Code</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Dark overlay with cutout */}
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          {/* Four corner strokes */}
          <View style={[ styles.corner, styles.tl ]} />
          <View style={[ styles.corner, styles.tr ]} />
          <View style={[ styles.corner, styles.bl ]} />
          <View style={[ styles.corner, styles.br ]} />
        </View>
      </View>
    </View>
  );
}

const SCAN_SIZE = 250;

const styles = StyleSheet.create({
  topBar: {
    position: "absolute",
    top: 55,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
    alignItems: "center",
  },
  back: {
    fontSize: 28,
    color: "#fff",
  },
  title: {
    fontSize: 18,
    color: "#fff",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  scanArea: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },

  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#fff",
    borderWidth: 4,
  },

  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
});
