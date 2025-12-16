import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Modal,
  NativeEventEmitter,
  NativeModules,
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


// Access the Custom Native Module
const { BlePayeeModule } = NativeModules;
const bleEventEmitter = new NativeEventEmitter(BlePayeeModule);

interface Props extends NativeStackScreenProps<FullNavStack> { }

const DeviceProximityScreen: React.FC<Props> = ({ navigation }) => {
  const [ showModal, setShowModal ] = useState(false);
  const [ amountInput, setAmountInput ] = useState("");

  // State for the active session
  const [ isBroadcasting, setIsBroadcasting ] = useState(false);
  const expectedAmountRef = useRef<number | null>(null);
  // const [ expectedAmount, setExpectedAmount ] = useState<number | null>(null);
  const [ transactionStatus, setTransactionStatus ] = useState("Initializing...");

  // Keep track of the subscription to remove it on unmount
  const eventListenerRef = useRef<any>(null);


  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (eventListenerRef.current) {
        eventListenerRef.current.remove();
      }
      // Note: You might want to expose a stopServer() method in native if you want to stop advertising cleanly
      // BlePayeeModule.stopServer();
    };
  }, []);

  /**
   * This function handles the "Business Logic" of the payment.
   * It is triggered when the Native Module receives a Write request from a Payer.
   */
  const handlePaymentIntent = async (intentJson: string) => {
    console.log("RAW INTENT RECEIVED:", intentJson);

    try {
      const intent = JSON.parse(intentJson);

      // 1. Verify the Intent matches what we requested
      // (Using a fuzzy comparison for float/string differences)
      if (parseFloat(intent.amount) !== expectedAmountRef.current) {
        setTransactionStatus("Error: Amount mismatch!");
        Alert.alert(
          "Error",
          `Payer tried to pay ${intent.amount}, but you asked for ${expectedAmountRef.current}`,
        );
        return;
      }

      setTransactionStatus("Verifying Payment...");

      // 2. Generate the Claim (The Receipt)
      // In a real app, you would sign this with a Private Key here.
      const claimPayload = {
        originalIntent: intent,
        merchantId: "MERCHANT_ID_888",
        status: "APPROVED",
        signature: "crypto_signature_placeholder_xyz",
        timestamp: Date.now(),
      };

      const claimJson = JSON.stringify(claimPayload);

      // 3. Send the Claim back to the Native Layer
      // The Native Layer updates the 'Read' Characteristic and notifies the Payer.
      BlePayeeModule.setConfirmationResponse(claimJson);

      // 4. Update UI
      setTransactionStatus("Payment Received!");
      Alert.alert("Success", "Payment confirmed and receipt sent to payer.");

      // Reset / Stop
      setIsBroadcasting(false);
      expectedAmountRef.current = null
    } catch (e) {
      console.error("Failed to process payment intent", e);
      setTransactionStatus("Error processing request");
    }
  };

  const startServer = async (amountValue: string) => {
    Keyboard.dismiss();

    try {
      // 1. Permission Check (Android 12+)
      if (Platform.OS === "android" && Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        const adPermission = granted[ "android.permission.BLUETOOTH_ADVERTISE" ];
        const conPermission = granted[ "android.permission.BLUETOOTH_CONNECT" ];

        if (
          adPermission !== PermissionsAndroid.RESULTS.GRANTED ||
          conPermission !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert(
            "Permission Denied",
            "Bluetooth Advertising permission is required.",
          );
          return;
        }
      }

      const floatAmount = parseFloat(amountValue);
      console.log('floatAmount', floatAmount)
      if (isNaN(floatAmount) || floatAmount <= 0) {
        Alert.alert("Invalid Amount", "Please enter a valid amount.");
        return;
      }

      // 2. Setup State
      expectedAmountRef.current = floatAmount
      setIsBroadcasting(true);
      setTransactionStatus(`Requesting $${floatAmount}...`);

      // 3. Start Listener
      if (eventListenerRef.current) eventListenerRef.current.remove();
      eventListenerRef.current = bleEventEmitter.addListener(
        "onPaymentIntent",
        handlePaymentIntent,
      );

      // 4. Start Native GATT Server
      // The Native module will now Advertise the Service UUID
      BlePayeeModule.startServer();

      // --- NEW CODE: SET THE BILL IMMEDIATELY ---
      // This ensures when the Payer connects, they see the amount immediately
      const initialBill = JSON.stringify({
        amount: floatAmount,
        merchantName: "Merchant_User", // You can make this dynamic
        status: "WAITING_FOR_PAYMENT"
      });

      console.log('initialBill', initialBill)

      // Give the server a split second to initialize, then set value
      setTimeout(() => {
        BlePayeeModule.setConfirmationResponse(initialBill);
      }, 500);
    } catch (error) {
      console.error("Server start failed:", error);
      Alert.alert("Error", "Failed to start Bluetooth server.");
      setIsBroadcasting(false);
    }
  };

  const stopServer = () => {
    // If you implemented stopServer in native, call it here.
    // Otherwise, we just reset the UI state.
    if (eventListenerRef.current) eventListenerRef.current.remove();
    setIsBroadcasting(false);
    setTransactionStatus("Stopped");
  };

  // --- UI HANDLERS ---

  const handleOpenModal = () => {
    setAmountInput("");
    setShowModal(true);
  };

  const handleConfirmRequest = () => {
    if (!amountInput.trim()) return;
    setShowModal(false);
    // Slight delay for modal animation
    setTimeout(() => {
      startServer(amountInput);
    }, 300);
  };

  return (
    <View className="justify-between items-center flex-1 bg-white">
      <HeaderSide heading="Receive Payment" isWithBack />

      <View className="w-full px-6 mt-8 items-center justify-center flex-1">
        {isBroadcasting
          ? (
            <View className="items-center justify-center bg-blue-50 p-6 rounded-full w-72 h-72 border-4 border-blue-100 shadow-sm">
              <ActivityIndicator
                size="large"
                color="#3B82F6"
                className="mb-4"
              />
              <AppText className="text-xl font-bold text-blue-600">
                {transactionStatus}
              </AppText>
              {expectedAmountRef.current && (
                <AppText className="text-3xl font-bold text-gray-800 mt-2">
                  ${expectedAmountRef.current}
                </AppText>
              )}
              <AppText className="text-xs text-center text-gray-500 mt-4 px-4">
                Payer should scan for Service UUID
              </AppText>
            </View>
          )
          : (
            <>
              <Image
                source={require("../../assets/user_phone_hand.png")}
                className="w-[200] h-[200] resize-contain mb-6"
              />
              <AppText className="text-2xl font-medium text-gray-800">
                Offline Payment
              </AppText>
              <AppText className="text-md font-thin text-center mt-2 px-8 text-gray-500">
                Become a Merchant Terminal. Request a payment and wait for a
                payer to connect via Bluetooth.
              </AppText>
            </>
          )}
      </View>

      {/* --- Action Buttons --- */}
      <View className="px-4 w-full flex-row justify-between mb-10 gap-4 mt-10">
        {isBroadcasting && (
          <Pressable
            className="bg-red-500 flex-1 items-center justify-center px-6 py-4 rounded-xl shadow-sm"
            onPress={stopServer}
          >
            <AppText className="text-white font-bold text-lg">
              Cancel Request
            </AppText>
          </Pressable>
        )}
        {!isBroadcasting && (
          <>
            <Pressable
              className="bg-gray-100 border border-gray-300 flex-1 items-center justify-center px-6 py-4 rounded-xl"
              onPress={() => {
                navigation.navigate("NearbyUsers");
              }}
            >
              <AppText className="text-gray-700 font-bold">
                I want to Pay
              </AppText>
            </Pressable>
            <Pressable
              onPress={handleOpenModal}
              className="bg-brand-700 flex-1 items-center justify-center px-6 py-4 rounded-xl shadow-md"
            >
              <AppText className="text-white font-bold">
                Request Payment
              </AppText>
            </Pressable>
          </>
        )}
      </View>

      {/* --- Input Modal --- */}
      <Modal
        transparent
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/60 items-center justify-center p-6"
          onPress={() => setShowModal(false)}
        >
          <Pressable
            className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl"
            onPress={() => { }}
          >
            <AppText className="text-xl font-bold text-center mb-2">
              Request Amount
            </AppText>
            <AppText className="text-sm text-gray-500 text-center mb-6">
              Enter the amount you wish to receive
            </AppText>

            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 mb-6 bg-gray-50">
              <AppText className="text-2xl font-bold text-gray-400 mr-2">
                $
              </AppText>
              <TextInput
                placeholder="0.00"
                keyboardType="numeric"
                autoFocus
                value={amountInput}
                onChangeText={setAmountInput}
                className="flex-1 py-4 text-3xl font-bold text-gray-800"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View className="flex-row gap-4">
              <Pressable
                onPress={() => setShowModal(false)}
                className="flex-1 py-3 rounded-lg bg-gray-200 items-center"
              >
                <AppText className="font-semibold text-gray-700">
                  Cancel
                </AppText>
              </Pressable>

              <Pressable
                onPress={handleConfirmRequest}
                className="flex-1 py-3 rounded-lg bg-brand-700 items-center"
              >
                <AppText className="font-bold text-white">Start</AppText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default DeviceProximityScreen;
