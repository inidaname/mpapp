import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HeaderSide from "../components/Main/HeaderSide";
import AppText from "../components/typo/AppText";
import { FullNavStack } from "../types/types";
import { SERVICE_UUID, WRITE_CHAR_UUID_STR } from '../data/constant';

const { BLEAdvertiser } = NativeModules;
const bleEventEmitter = new NativeEventEmitter(BLEAdvertiser);

interface Props extends NativeStackScreenProps<FullNavStack> { }

const DeviceProximityScreen: React.FC<Props> = ({ navigation }) => {
  const [ showModal, setShowModal ] = useState(false);
  const [ amount, setAmount ] = useState("");
  const [ isBroadcasting, setIsBroadcasting ] = useState(false);
  const [ , setLastMessage ] = useState(""); // Unused variable warning fix

  // --- Combined Lifecycle Effect ---
  useEffect(() => {
    // 1. Setup Listener
    const subscription = bleEventEmitter.addListener("onPaymentResponse", (event) => {
      console.log("Received:", event);
      if (event.message === "ACCEPTED") {
        Alert.alert("Payment Received!", "The user has accepted the transaction.");
        setLastMessage("Payment Successful");
        stopBroadcasting(); // Stop broadcasting after success?
      }
    });

    // 2. Cleanup on Unmount
    return () => {
      subscription.remove();
      // Ensure we stop broadcast when user leaves screen
      BLEAdvertiser.stopBroadcast();
    };
  }, []);

  const stopBroadcasting = () => {
    try {
      BLEAdvertiser.stopBroadcast();
      setIsBroadcasting(false);
    } catch (error) {
      console.warn("Error stopping broadcast:", error);
    }
  };

  const startBroadcasting = async (amountValue: string) => {
    try {
      if (Platform.OS === "android" && Platform.Version >= 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission Denied", "Bluetooth Advertising permission is required.");
          return;
        }
      }

      const username = "User_" + Math.floor(Math.random() * 1000);
      const floatAmount = parseFloat(amountValue);

      if (isNaN(floatAmount)) {
        Alert.alert("Error", "Please enter a valid amount");
        return;
      }

      BLEAdvertiser.startBroadcast(
        username,
        floatAmount,
        SERVICE_UUID,
        WRITE_CHAR_UUID_STR
      );

      setIsBroadcasting(true);
    } catch (error) {
      console.error("Broadcast failed:", error);
      Alert.alert("Error", "Failed to start Bluetooth broadcasting.");
      setIsBroadcasting(false);
    }
  };

  const closeModal = () => {
    setAmount("");
    setShowModal(false);
  };

  const handleConfirm = () => {
    if (!amount.trim()) return;
    setShowModal(false);
    startBroadcasting(amount);
  };

  return (
    <View className="justify-between items-center flex-1 bg-white">
      <HeaderSide heading="Set Up Device Proximity" isWithBack />

      <View className="w-full px-6 mt-8 items-center justify-center">
        {isBroadcasting ? (
          <View className="items-center justify-center bg-blue-50 p-6 rounded-full w-64 h-64 border-4 border-blue-100">
            <ActivityIndicator size="large" color="#3B82F6" />
            <AppText className="text-xl mt-4 font-bold text-blue-600">Broadcasting...</AppText>
            <AppText className="text-lg font-medium text-gray-600 mt-2">${amount}</AppText>
            <AppText className="text-xs text-center text-gray-400 mt-2">Hold near the receiver device</AppText>
          </View>
        ) : (
          <>
            <Image source={require("../../assets/user_phone_hand.png")} className="w-[200] h-[200] resize-contain" />
            <AppText className="text-2xl mt-8 font-medium">Enable Bluetooth/NFC</AppText>
            <AppText className="text-md font-thin text-center mt-2 px-4">
              Enable your phone's Bluetooth to connect with the recipient device.
            </AppText>
          </>
        )}
      </View>

      <View className="px-4 w-full flex-row justify-between mb-10 gap-4 mt-10">
        {isBroadcasting ? (
          <Pressable className="bg-red-500 flex-1 items-center justify-center px-6 py-3 rounded-lg" onPress={stopBroadcasting}>
            <AppText className="text-white font-medium">Cancel Payment</AppText>
          </Pressable>
        ) : (
          <>
            <Pressable className="bg-brand-700 flex-1 items-center justify-center px-6 py-3 rounded-lg" onPress={() => navigation.navigate("NearbyUsers")}>
              <AppText className="text-white font-medium">Search</AppText>
            </Pressable>

            <Pressable onPress={() => setShowModal(true)} style={{ borderWidth: 1 }} className="border-brand-700 border-1 px-6 py-3 flex-1 rounded-lg items-center justify-center">
              <AppText className="text-brand-700 font-medium">Request Payment</AppText>
            </Pressable>
          </>
        )}
      </View>

      <Modal transparent visible={showModal} animationType="fade" onRequestClose={closeModal}>
        <View className="flex-1 bg-black/50 items-center justify-center p-6">
          <View className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
            <AppText className="text-lg font-medium mb-4">Enter Amount to Pay</AppText>
            <TextInput
              placeholder="0.00"
              keyboardType="numeric"
              autoFocus
              value={amount}
              onChangeText={setAmount}
              className="border border-gray-300 p-4 rounded-lg mb-6 text-xl text-center font-bold"
            />
            <View className="flex-row justify-end space-x-4 gap-4">
              <Pressable onPress={closeModal} className="px-4 py-3 rounded-lg bg-gray-200 flex-1 items-center">
                <AppText>Cancel</AppText>
              </Pressable>
              <Pressable onPress={handleConfirm} className="px-4 py-3 rounded-lg bg-blue-500 flex-1 items-center">
                <AppText className="text-white font-bold">OK</AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeviceProximityScreen;