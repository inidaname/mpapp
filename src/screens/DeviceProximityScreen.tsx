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
  FlatList,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HeaderSide from "../components/Main/HeaderSide";
import AppText from "../components/typo/AppText";
import { FullNavStack } from "../types/types";

// Redux Imports
import { useAppSelector, useAppDispatch } from '../store/redux';
import { addOfflineTransaction } from '../store/reducers/offline-transactions';
import { creditOffline } from '../store/reducers/offline-slice';

// Access the Custom Native Module
const { BlePayeeModule } = NativeModules;
const bleEventEmitter = new NativeEventEmitter(BlePayeeModule);

type Props = NativeStackScreenProps<
  FullNavStack,
  "DeviceProximityScreen"
>;


const DeviceProximityScreen: React.FC<Props> = ({ navigation }) => {
  const canNavigate = typeof navigation?.navigate === "function";

  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector(state => state.offlineTransactions);
  const reversedTransactions = [ ...transactions ].reverse();

  const { active_wallet_address } = useAppSelector(state => state.wallet);
  const { profile } = useAppSelector(state => state.user);

  const [ showModal, setShowModal ] = useState(false);
  const [ amountInput, setAmountInput ] = useState("");

  // State for the active session
  const [ isBroadcasting, setIsBroadcasting ] = useState(false);
  const expectedAmountRef = useRef<number | null>(null);
  const [ transactionStatus, setTransactionStatus ] = useState("Initializing...");
  const eventListenerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (eventListenerRef.current) {
        eventListenerRef.current.remove();
      }
    };
  }, []);

  const handlePaymentIntent = async (intentJson: string) => {
    console.log("RAW INTENT RECEIVED:", intentJson);

    try {
      const intent = JSON.parse(intentJson);

      if (parseFloat(intent.amount) !== expectedAmountRef.current) {
        setTransactionStatus("Error: Amount mismatch!");
        Alert.alert(
          "Error",
          `Payer tried to pay ${intent.amount}, but you asked for ${expectedAmountRef.current}`,
        );
        return;
      }

      setTransactionStatus("Verifying Payment...");

      const claimPayload = {
        originalIntent: intent,
        merchantId: "MERCHANT_ID_888",
        status: "APPROVED",
        signature: "crypto_signature_placeholder_xyz",
        timestamp: Date.now(),
      };

      const claimJson = JSON.stringify(claimPayload);

      // Send response to payer via BLE
      BlePayeeModule.setConfirmationResponse(claimJson);

      setTransactionStatus("Payment Received!");
      Alert.alert("Success", "Payment confirmed and receipt sent to payer.");

      // 2. Dispatch to Redux
      const newTx: OfflineTransactions = {
        reference: `REF-${Date.now()}`,
        amount: expectedAmountRef.current || 0,
        createdAt: new Date().toISOString(),
        type: "credit", // Merchant receives Credit
        status: "completed",
        synced: false,
        name: intent.name || "Unknown Payer",
        address: intent.address || null,
        signature: "crypto_signature_placeholder_xyz",
        syncedAt: null
      };

      dispatch(addOfflineTransaction(newTx));
      dispatch(creditOffline(expectedAmountRef.current || 0))
      setIsBroadcasting(false);
      expectedAmountRef.current = null;

    } catch (e) {
      console.error("Failed to process payment intent", e);
      setTransactionStatus("Error processing request");
    }
  };

  const startServer = async (amountValue: string) => {
    Keyboard.dismiss();
    try {
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
          Alert.alert("Permission Denied", "Bluetooth Advertising permission is required.");
          return;
        }
      }

      const floatAmount = parseFloat(amountValue);
      if (isNaN(floatAmount) || floatAmount <= 0) {
        Alert.alert("Invalid Amount", "Please enter a valid amount.");
        return;
      }

      expectedAmountRef.current = floatAmount;
      setIsBroadcasting(true);
      setTransactionStatus(`Requesting $${floatAmount}...`);

      if (eventListenerRef.current) eventListenerRef.current.remove();
      eventListenerRef.current = bleEventEmitter.addListener(
        "onPaymentIntent",
        handlePaymentIntent,
      );


      const username = profile?.username || "Insfer User"

      BlePayeeModule.startServer(username);

      const initialBill = JSON.stringify({
        amount: floatAmount,
        address: active_wallet_address,
        status: "WAITING_FOR_PAYMENT"
      });

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
    if (eventListenerRef.current) eventListenerRef.current.remove();
    setIsBroadcasting(false);
    setTransactionStatus("Stopped");
  };

  const handleOpenModal = () => {
    setAmountInput("");
    setShowModal(true);
  };

  const handleConfirmRequest = () => {
    if (!amountInput.trim()) return;
    setShowModal(false);
    setTimeout(() => {
      startServer(amountInput);
    }, 300);
  };

  const goToNearBy = () => {
    navigation.navigate("NearbyUsers");
  }

  const renderHistoryItem = ({ item }: { item: OfflineTransactions }) => {
    const isCredit = item.type === 'credit';
    const dateObj = item.createdAt ? new Date(item.createdAt) : new Date();

    return (
      <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-xl mb-3 border border-gray-100 w-full">
        <View className="flex-row items-center gap-3">
          {/* Icon based on Type */}
          <View className={`w-10 h-10 rounded-full items-center justify-center ${isCredit ? 'bg-green-100' : 'bg-red-100'}`}>
            <AppText className={`text-xs font-bold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
              {isCredit ? 'IN' : 'OUT'}
            </AppText>
          </View>

          <View>
            <AppText className="font-bold text-gray-800">
              {item.name || "Unknown"}
            </AppText>
            <View className="flex-row items-center gap-1">
              <AppText className="text-xs text-gray-500">
                {dateObj.toLocaleDateString()} • {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </AppText>
              {!item.synced && (
                <AppText className="text-[10px] text-orange-500 bg-orange-100 px-1 rounded">
                  Not Synced
                </AppText>
              )}
            </View>
          </View>
        </View>

        <View className="items-end">
          <AppText className={`font-bold text-lg ${isCredit ? 'text-green-600' : 'text-gray-800'}`}>
            {isCredit ? '+' : '-'}${item.amount?.toFixed(2)}
          </AppText>
          <AppText className="text-[10px] text-gray-400">
            {item.status?.toUpperCase()}
          </AppText>
        </View>
      </View>
    );
  };

  return (
    <View className="justify-between items-center flex-1 bg-white">
      <HeaderSide heading="Receive Payment" isWithBack />

      {/* 
        CONDITIONAL LAYOUT:
        1. Broadcasting -> Center Spinner
        2. History Exists -> Top Aligned List
        3. Default -> Center Placeholder
      */}
      <View className={`w-full px-6 mt-8 flex-1 ${(!isBroadcasting && reversedTransactions?.length > 0) ? 'justify-start' : 'justify-center items-center'}`}>

        {isBroadcasting && (
          // --- STATE 1: BROADCASTING ---
          <View className="items-center justify-center bg-blue-50 p-6 rounded-full w-72 h-72 border-4 border-blue-100 shadow-sm">
            <ActivityIndicator size="large" color="#3B82F6" className="mb-4" />
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

        )}
        {!isBroadcasting && reversedTransactions.length > 0 && (

          // --- STATE 2: REDUX LIST ---
          <View className="w-full flex-1">
            <View className="flex-row justify-between items-end mb-4">
              <AppText className="text-xl font-bold text-gray-800">Recent Transactions</AppText>
              <View />
              {/* <Pressable onPress={() => dispatch(resetOfflineTransactions())}>
                <AppText className="text-sm text-red-500 font-medium">Clear All</AppText>
              </Pressable> */}
            </View>

            <FlatList
              data={reversedTransactions}
              keyExtractor={(item) => item.reference || Math.random().toString()}
              renderItem={renderHistoryItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>

        )}
        {!isBroadcasting && reversedTransactions.length === 0 && (

          // --- STATE 3: PLACEHOLDER ---
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
      <View className="px-4 w-full flex-row justify-between mb-10 gap-4 mt-4">
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
        {!isBroadcasting && canNavigate && (
          <>
            <Pressable
              className="bg-gray-100 border border-gray-300 flex-1 items-center justify-center px-6 py-4 rounded-xl"
              onPress={goToNearBy}
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

      {/* --- Input Modal (Same as before) --- */}
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