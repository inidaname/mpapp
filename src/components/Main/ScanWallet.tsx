import React, { useEffect, useState } from "react";
import {
  Alert,
  // Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import AppText from "../typo/AppText";

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const device = useCameraDevice("back");

  // Ask for permission
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      if (status !== "granted") {
        console.log("Camera permission denied");
      }
    })();
  }, []);

  // Built-in QR code scanner
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        const qrValue = codes[0].value;
        setScanning(false);
        Alert.alert("QR Code Scanned", qrValue || "No data found");
      }
    },
  });

  if (!device) return <Text>Loading camera...</Text>;

  return (
    <>
      <TouchableOpacity
        onPress={() => setScanning(true)}
        className="bg-blue-500 px-4 py-2 rounded-full"
      >
        <AppText className="text-white font-semibold">Scan</AppText>
      </TouchableOpacity>
      {scanning &&
        (
          <View className="absolute h-screen w-screen z-10 left-0 top-0">
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={scanning}
              codeScanner={codeScanner}
            />
          </View>
        )}
    </>
  );
}
