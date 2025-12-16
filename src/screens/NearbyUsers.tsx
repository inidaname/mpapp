import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Buffer } from "buffer";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import AppText from "../components/typo/AppText";
import HeaderSide from "../components/Main/HeaderSide";
import { PAYMENT_CONFIRM_CHAR_UUID, PAYMENT_INTENT_CHAR_UUID, SERVICE_UUID } from "../data/constant";
import { bleManager, requestPermissions } from "../utils/ble-service";

type NearbyUser = {
  deviceId: string;
  name: string;
  amount?: string;
  receiverName?: string;
  isConnected: boolean;
  loading: boolean;
};

const NearbyUsersScreen: React.FC = () => {
  const [ nearby, setNearby ] = useState<NearbyUser[]>([]);
  const pulseAnim1 = useRef(new Animated.Value(0)).current;

  // Animation Loop
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim1, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim1, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ).start();
  }, [ pulseAnim1 ]);

  // Scan Logic
  useEffect(() => {
    const startScan = async () => {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert("Permission Error", "Bluetooth permissions are required.");
        return;
      }

      console.log("Starting Scan...");
      setNearby([]);

      bleManager.startDeviceScan(
        [ SERVICE_UUID ],
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error("Scan error:", error);
            return;
          }

          if (device) {
            setNearby((prev) => {
              if (prev.find((u) => u.deviceId === device.id)) return prev;

              return [
                ...prev,
                {
                  deviceId: device.id,
                  name: device.name || "Unknown Device",
                  isConnected: false,
                  loading: false,
                  amount: undefined
                },
              ];
            });
          }
        },
      );
    };

    startScan();

    return () => {
      console.log("Stopping Scan");
      bleManager.stopDeviceScan();
    };
  }, []);

  // Step 1: Connect and Read the Bill
  const handleConnectAndRead = async (index: number) => {
    const user = nearby[ index ];

    const updateState = (updates: Partial<NearbyUser>) => {
      setNearby(prev => {
        const newArr = [ ...prev ];
        newArr[ index ] = { ...newArr[ index ], ...updates };
        return newArr;
      });
    };

    updateState({ loading: true });

    try {
      console.log(`Connecting to ${user.deviceId}...`);

      // 1. Connect
      const device = await bleManager.connectToDevice(user.deviceId, {
        autoConnect: false,
        requestMTU: 512
      });

      // 2. Discover
      await device.discoverAllServicesAndCharacteristics();

      // 3. READ the Characteristic (The Bill)
      // Note: calling readCharacteristicForService on the DEVICE instance is correct
      const characteristic = await device.readCharacteristicForService(
        SERVICE_UUID.toLowerCase(),
        PAYMENT_CONFIRM_CHAR_UUID.toLowerCase()
      );

      if (characteristic.value) {
        const jsonString = Buffer.from(characteristic.value, 'base64').toString('utf8');
        console.log("Read Bill:", jsonString);

        let billData;
        try {
          billData = JSON.parse(jsonString); // { amount: 50, receiverName: "UserB" }
        } catch (e) {
          // Fallback for non-JSON strings
          billData = { amount: "0", receiverName: "Unknown" };
        }

        updateState({
          isConnected: true,
          loading: false,
          amount: billData.amount?.toString(),
          receiverName: billData.receiverName
        });
      }
    } catch (error) {
      console.error("Connection failed", error);
      Alert.alert("Connection Failed", "Could not read payment details.");
      setNearby([]);
    }
  };


  // Step 2: Write Confirmation
  const handlePay = async (index: number) => {
    const user = nearby[ index ];

    try {
      console.log("Sending Payment...");

      const receipt = JSON.stringify({
        amount: user.amount,
        status: "PAID",
        txId: "0x123456789",
        sender: "User_A",
        nonce: Math.random().toString()
      });

      const payload = Buffer.from(receipt).toString("base64");

      // --- FIXED LINE BELOW ---
      // Using 'writeCharacteristicWithResponseForDevice' because we are calling it on 'bleManager'
      await bleManager.writeCharacteristicWithResponseForDevice(
        user.deviceId,
        SERVICE_UUID.toLowerCase(),
        PAYMENT_INTENT_CHAR_UUID.toLowerCase(),
        payload
      );


      // 3. LISTEN FOR RECEIPT (Important!)
      // We need to know if the merchant approved it.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const device = await bleManager.devices([ user.deviceId ]); // Get device instance
      // Note: In ble-plx you usually keep the device object reference. 
      // Assuming you can get the device object or use bleManager.monitorCharacteristicForDevice

      // console.log("Waiting for confirmation...");

      // const subscription = bleManager.monitorCharacteristicForDevice(
      //   user.deviceId,
      //   SERVICE_UUID.toLowerCase(),
      //   PAYMENT_CONFIRM_CHAR_UUID.toLowerCase(),
      //   (error, char) => {
      //     if (char?.value) {
      //       const response = JSON.parse(Buffer.from(char.value, 'base64').toString('utf8'));

      //       if (response.status === "APPROVED") {
      //         Alert.alert("Success", "Payment Approved by Merchant!");
      //         subscription.remove(); // Stop listening
      //         bleManager.cancelDeviceConnection(user.deviceId); // Disconnect

      //         // Remove from list
      //         setNearby(prev => prev.filter(u => u.deviceId !== user.deviceId));
      //       }
      //     }
      //   }
      // );

      Alert.alert("Success", `Paid $${user.amount} to ${user.receiverName || user.name}`);

      // Disconnect
      try {
        await bleManager.cancelDeviceConnection(user.deviceId);
      } catch (e) {
        console.log("Already disconnected");
      }

      setNearby(prev => prev.filter(u => u.deviceId !== user.deviceId));

    } catch (error) {
      console.error("Payment failed", error);
      Alert.alert("Error", "Payment transmission failed.");
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-between">
      <HeaderSide heading="Search Nearby Users" isWithBack />

      <View className="items-center justify-center mt-10">
        <Ring anim={pulseAnim1} color="bg-blue-500" />
        <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center">
          <MaterialIcons name="sensors" size={40} color="white" />
        </View>
      </View>

      <View className="bottom-8 w-11/12 bg-gray-100 p-4 rounded-xl h-1/2">
        <AppText className="font-bold text-base mb-2">
          Found Receivers ({nearby.length})
        </AppText>

        {nearby.map((u, index) => (
          <View
            key={u.deviceId}
            className="flex-row items-center justify-between bg-white p-4 rounded-lg shadow mb-2"
          >
            <View>
              {u.isConnected && u.amount ? (
                <>
                  <AppText className="font-bold text-lg text-green-600">
                    ${u.amount}
                  </AppText>
                  <AppText className="text-xs text-gray-500">
                    Pay to: {u.receiverName || u.name}
                  </AppText>
                </>
              ) : (
                <AppText className="font-medium text-sm text-gray-800">
                  {u.name || u.deviceId}
                </AppText>
              )}
            </View>

            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${u.isConnected ? "bg-green-500" : "bg-blue-500"}`}
              onPress={() => {
                if (u.isConnected) {
                  handlePay(index);
                } else {
                  handleConnectAndRead(index);
                }
              }}
              disabled={u.loading}
            >
              {u.loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <AppText className="text-white font-bold">
                  {u.isConnected ? "PAY NOW" : "Connect"}
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

export default NearbyUsersScreen

function Ring({ anim, color }: { anim: Animated.Value; color: string }) {
  const scale = anim.interpolate({
    inputRange: [ 0, 1 ],
    outputRange: [ 0.6, 2.5 ],
  });
  const opacity = anim.interpolate({
    inputRange: [ 0, 1 ],
    outputRange: [ 0.6, 0 ],
  });
  return (
    <Animated.View
      style={{ transform: [ { scale } ], opacity }}
      className={`absolute w-64 h-64 rounded-full ${color}`}
    />
  );
}