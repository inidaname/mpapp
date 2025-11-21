import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

type Props = NativeStackScreenProps<FullNavStack>;

export default function ScanWalletScreen({ navigation }: Props) {
  const [hasPermission, setHasPermission] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearScannedAddress());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      if (status !== "granted") {
        navigation.goBack();
      } else {
        setHasPermission(true);
      }
    })();
  }, [navigation]);

  const device = useCameraDevice("back");

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        const qr = codes[0].value || "";
        // navigation.navigate("Home", {
        //   screen: "Send",
        //   params: { wallet_address: qr },
        // });
        dispatch(setScannedAddress(qr));
        dispatch(setScanned(true));
        navigation.goBack();
      }
    },
  });

  if (!hasPermission || !device) return null;

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>×</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Scan QR Code</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Dark overlay with cutout */}
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          {/* Four corner strokes */}
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
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
