import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, TouchableOpacity, View } from "react-native";
import { decode as b64decode } from "base64-arraybuffer";
import { Buffer } from "buffer";
import MaterialIcons from "@react-native-vector-icons/material-icons";

// IMPORTS FROM YOUR FILES
import AppText from "../components/typo/AppText";
import HeaderSide from "../components/Main/HeaderSide";
import { WRITE_CHAR_UUID_STR, SERVICE_UUID } from "../data/constant";
import { bleManager, requestPermissions } from "../utils/ble-service";

type NearbyUser = {
  deviceId: string;
  name: string | null;
  avatar?: string;
  displayName?: string;
  userId?: string;
  loaded: boolean;
  amount?: string
};

export default function NearbyUsersScreen() {
  const [nearby, setNearby] = useState<NearbyUser[]>([]);
  const pulseAnim1 = useRef(new Animated.Value(0)).current;

  // Animation Logic (Simplified for brevity)
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim1, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim1, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim1]);

  // SCANNING LOGIC
  useEffect(() => {
    const startScan = async () => {

      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert("Permission Error", "Bluetooth permissions are required.");
        return;
      }

      console.log("Starting Scan...");

      bleManager.startDeviceScan(
        [SERVICE_UUID],
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error("Scan error:", error);
            // Handle Bluetooth being off
            if (error.reason === "Bluetooth Powered Off") {
              Alert.alert("Bluetooth is Off", "Please turn on Bluetooth.");
            }
            return;
          }

          if (device) {

            // console.log("Device found:", device);

            setNearby((prev) => {
              let decoded
            if (device.serviceData) {

              const bytes = Buffer.from(device.serviceData[SERVICE_UUID.toLowerCase()], 'base64');
              decoded = bytes.toString('utf8');
            }
              // Prevent duplicates
              if (prev.find((u) => u.deviceId === device.id)) return prev;
              return [
                ...prev,
                {
                  deviceId: device.id,
                  name: device.name ?? "Unknown User",
                  amount: decoded,
                  loaded: false,
                },
              ];
            });
          }
        },
      );
    };

    startScan();

    // Cleanup: Stop scan when leaving screen
    return () => {
      console.log("Stopping Scan");
      bleManager.stopDeviceScan();
    };
  }, []);


  const handleSendPayment = async (device: NearbyUser) => {
  try {
    console.log("Connecting to...", device.name);
    
    // 1. Connect
    const connectedDevice = await bleManager.connectToDevice(device.deviceId, { 
      autoConnect: false, 
      requestMTU: 512 // Helps with stability
    });
    
    // 2. Discover Services (Crucial step!)
    await connectedDevice.discoverAllServicesAndCharacteristics();
    
    // 3. Prepare Payload
    // You can send JSON here: JSON.stringify({ status: "ACCEPTED", txId: "123" })
    const payload = Buffer.from("ACCEPTED").toString("base64");
    
    // 4. Write to the Broadcaster
    await connectedDevice.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      WRITE_CHAR_UUID_STR,
      payload
    );

    Alert.alert("Success", "Payment sent offline!");
    
    // 5. Disconnect
    await connectedDevice.cancelConnection();

  } catch (error) {
    console.error("Payment failed", error);
    Alert.alert("Error", "Could not connect to device. Ensure they are still broadcasting.");
  }
};


  return (
    <View className="flex-1 bg-white items-center justify-between">
      <HeaderSide heading="Search Nearby Users" isWithBack />
      {/* Visuals */}
      <View className="items-center justify-center mt-10">
        <Ring anim={pulseAnim1} color="bg-blue-500" />
        <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center">
          <MaterialIcons name="sensors" size={40} color="white" />
        </View>
      </View>

      {/* List */}
      <View className="bottom-8 w-11/12 bg-gray-100 p-4 rounded-xl">
        <AppText className="font-bold text-base mb-2">
          Nearby Users ({nearby.length})
        </AppText>
        {nearby.map((u) => (
          <View
            key={u.deviceId}
            className="flex-row items-center justify-between bg-white p-3 rounded-lg shadow mb-2"
          >
            <AppText className="font-medium text-sm">
 ${!u.loaded ? u.amount : u.name}
            </AppText>
            <TouchableOpacity
              className="bg-blue-500 px-4 py-2 rounded-lg"
              onPress={() => handleSendPayment(u)}
            >
              <AppText className="text-white">
                {u.loaded ? "Select" : "Connect"}
              </AppText>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

function Ring({ anim, color }: { anim: Animated.Value; color: string }) {
  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 2.5],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });
  return (
    <Animated.View
      style={{ transform: [{ scale }], opacity }}
      className={`absolute w-64 h-64 rounded-full ${color}`}
    />
  );
}
