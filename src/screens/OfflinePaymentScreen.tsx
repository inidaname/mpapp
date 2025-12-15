import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";

import HeaderSide from "../components/Main/HeaderSide";
import AppText from "../components/typo/AppText";
import NetworkPerson from "../../assets/network_person.svg";
import ButtonComponent from "../components/Button";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";
import { useAppDispatch, useAppSelector } from '../store/redux';
import { credit, debit } from '../store/reducers/fake-slice';
import { creditOffline, debitOffline } from '../store/reducers/offline-slice';

interface Props extends NativeStackScreenProps<FullNavStack> { }

type TransactionMode = "load" | "return";


const OfflinePaymentScreen: React.FC<Props> = ({ navigation }) => {
  // State for balances and modal
  // const [ offlineBalance, setOfflineBalance ] = useState<number>(45.50);
  // const [ mainBalance, setMainBalance ] = useState<number>(2450.00);
  const [ isModalVisible, setModalVisible ] = useState(false);
  const [ transferAmount, setTransferAmount ] = useState("");
  const { fakeBalance } = useAppSelector(state => state.fakeSlice)
  const { offlineBalance, offline } = useAppSelector(state => state.offlineSlice)
  const dispatch = useAppDispatch()

  const [ modalMode, setModalMode ] = useState<TransactionMode>('load');


  const openModal = (mode: TransactionMode) => {
    setModalMode(mode);
    setModalVisible(true);
  };

  // Mock "Last Online" timestamp
  const lastSynced = "Today, 10:30 AM";

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);

    if (offline) {
      Alert.alert("Offline", "You will need to be online to add funds");
      return;
    }


    if (!amount || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    if (amount > fakeBalance) {
      Alert.alert("Insufficient Funds", "You do not have enough in your main wallet.");
      return;
    }

    if (modalMode === 'load') {
      if (amount > fakeBalance) return Alert.alert("Error", "Insufficient Main Balance");
      // Debit the main wallet balance
      dispatch(debit(amount))

      // credit offline wallet 
      dispatch(creditOffline(amount))
    } else {
      if (amount > offlineBalance) return Alert.alert("Error", "Insufficient Offline Balance");
      dispatch(credit(amount))
      dispatch(debitOffline(amount))
    }

    setTransferAmount("");
    setModalVisible(false);
    Alert.alert("Success", `$${amount} moved to Offline Wallet!`);
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderSide heading="Offline Wallet" isWithBack />

      <View className="flex-1 justify-between pb-4">
        {/* Scrollable Content Container */}
        <View className="justify-center items-center flex-1 px-4 pt-1">

          {/* --- OFFLINE BALANCE SECTION --- */}
          <View className="items-center justify-between mb-6 w-full">
            <AppText className="text-brand-900 text-4xl font-extrabold">
              ${offlineBalance.toFixed(2)}
            </AppText>
            <AppText className="text-gray-500 text-xs uppercase tracking-widest mb-3">
              Available Offline Balance
            </AppText>

            {/* Load Funds Button */}
            <View className="flex-row gap-x-3">
              {/* Load Button (Main -> Offline) */}
              <TouchableOpacity
                onPress={() => openModal("load")}
                className="bg-brand-50 border border-brand-200 py-2 px-5 rounded-full flex-row items-center active:bg-brand-100"
              >
                <AppText className="text-brand-700 font-bold text-sm mr-1">↓</AppText>
                <AppText className="text-brand-700 font-semibold text-sm">
                  Load Funds
                </AppText>
              </TouchableOpacity>

              {/* Return Button (Offline -> Main) */}
              <TouchableOpacity
                onPress={() => openModal("return")}
                className="bg-white border border-gray-300 py-2 px-5 rounded-full flex-row items-center active:bg-gray-50 shadow-sm"
              >
                <AppText className="text-gray-600 font-bold text-sm mr-1">↑</AppText>
                <AppText className="text-gray-600 font-semibold text-sm">
                  Return
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Main Balance Context (Cached View) */}
            <View className="mt-8 bg-gray-50 p-4 rounded-2xl w-full border border-gray-100 flex-row justify-between items-center">
              <View>
                <View className="flex-row items-center mb-1">
                  <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                  <AppText className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">
                    Online Main Balance
                  </AppText>
                </View>
                <AppText className="text-gray-800 font-bold text-xl">${fakeBalance.toFixed(2)}</AppText>
              </View>
              <View className="items-end">
                <AppText className="text-gray-400 text-[10px]">Last Synced</AppText>
                <AppText className="text-gray-500 text-[11px] font-medium">{lastSynced}</AppText>
              </View>
            </View>


          </View>

          {/* --- ICON VISUALIZATION --- */}
          <View className="p-6 bg-gray-100/60 rounded-full justify-center items-center">
            <View className="p-6 bg-gray-200/60 rounded-full justify-center items-center">
              <View className="p-2 bg-brand-600 rounded-full justify-center items-center shadow-md">
                <NetworkPerson width={32} height={32} />
              </View>
            </View>
          </View>

          {/* --- DESCRIPTION --- */}
          <AppText weight="medium" className="text-brand-700 mt-6 text-xl text-center">
            Ready for Proximity Pay
          </AppText>
          <AppText className="text-center px-4 mt-2 text-sm text-gray-500">
            Connect via Bluetooth or NFC to pay nearby users. Transactions sync automatically when back online.
          </AppText>
        </View>

        <View className="px-4 w-full gap-y-1">
          <View className="items-center mb-2">
            <AppText className="text-xs text-gray-400">
              Last synced: Just now
            </AppText>
          </View>

          <ButtonComponent
            label="Start Proximity Payment"
            onPress={() => navigation.navigate("DeviceProximityScreen")}
          />
        </View>
      </View>

      {/* --- LOAD FUNDS MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-end"
          >
            <View className="absolute inset-0 bg-black/50" />
            <TouchableOpacity className="flex-1" activeOpacity={1} onPress={() => setModalVisible(false)} />

            <View className="bg-white rounded-t-3xl p-6 pb-10 shadow-2xl">
              {/* Header */}
              <View className="items-center mb-6">
                <View className="w-12 h-1 bg-gray-300 rounded-full mb-4" />
                <AppText weight="bold" className="text-xl text-gray-800">
                  {modalMode === "load" ? "Load Offline Wallet" : "Return to Main Wallet"}
                </AppText>
                <AppText className="text-gray-500 text-center text-sm mt-1 px-4">
                  {modalMode === "load"
                    ? "Move funds from your main wallet to secure them for offline use."
                    : "Move unused offline funds back to your main wallet."}
                </AppText>
              </View>

              {/* Dynamic Source Display */}
              <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                <View>
                  <AppText className="text-gray-500 text-xs">From: {modalMode === 'load' ? 'Main Wallet' : 'Offline Wallet'}</AppText>
                  <AppText className="text-gray-800 font-bold">
                    ${modalMode === 'load' ? fakeBalance.toFixed(2) : offlineBalance.toFixed(2)}
                  </AppText>
                </View>
                <View className="bg-gray-200 px-2 py-1 rounded">
                  <AppText className="text-gray-600 font-bold text-xs uppercase">Source</AppText>
                </View>
              </View>

              {/* Input */}
              <AppText className="text-gray-700 font-medium mb-2 ml-1">Amount</AppText>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:border-brand-500 bg-white">
                <AppText className="text-gray-900 text-lg font-bold mr-2">$</AppText>
                <TextInput
                  className="flex-1 text-lg font-bold text-gray-900 h-full"
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={transferAmount}
                  onChangeText={setTransferAmount}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Actions */}
              <View className="gap-y-3">
                <ButtonComponent
                  label={modalMode === "load" ? "Confirm Load" : "Confirm Return"}
                  onPress={handleTransfer}
                />
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="py-3 items-center"
                >
                  <AppText className="text-gray-500 font-medium">Cancel</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default OfflinePaymentScreen;