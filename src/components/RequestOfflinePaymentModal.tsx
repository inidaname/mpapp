import type React from 'react'
import { useState } from 'react';

import {
  Alert,
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
import AppText from './typo/AppText'

const { BlePayeeModule } = NativeModules;
const bleEventEmitter = new NativeEventEmitter(BlePayeeModule);

interface Props {
  expectedAmountRef: React.RefObject<number | null>
  setTransactionStatus: (value: React.SetStateAction<string>) => void
  setIsBroadcasting: (value: React.SetStateAction<boolean>) => void
  eventListenerRef: React.RefObject<any>
}

const RequestOfflinePaymentModal: React.FC<Props> = ({ expectedAmountRef, eventListenerRef, setTransactionStatus, setIsBroadcasting }) => {

  const [ showModal, setShowModal ] = useState(false);
  const [ amountInput, setAmountInput ] = useState("");


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
    <>
      <View className="px-4 w-full flex-row justify-between mb-10 gap-4 mt-10">
        <Pressable
          className="bg-gray-100 border border-gray-300 flex-1 items-center justify-center px-6 py-4 rounded-xl"
          onPress={() => {
            // navigation.navigate("NearbyUsers");
            console.log('first')
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
      </View>
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
    </>

  )
}

export default RequestOfflinePaymentModal