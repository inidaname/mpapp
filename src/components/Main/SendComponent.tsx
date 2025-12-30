import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CheckBox from "@react-native-community/checkbox";

// Types & Store
import { FullNavStack } from "../../types/types";
import { useSendTransactionMutation } from "../../service/endpoints/transactions-endpoints";
import { useAppDispatch, useAppSelector } from "../../store/redux";
import {
  clearScannedAddress,
  setScanned,
} from "../../store/reducers/scan-wallet-slice";

// Components & Hooks
import AppText from "../typo/AppText";
import ButtonComponent from "../Button";
import useAutoPaste from "../../hooks/useAutoPaste";

interface Props
  extends
  Pick<NativeStackScreenProps<FullNavStack, "Send">, "navigation" | "route"> {
  token_id: string;
  wallet_balance: string;
}

const SendComponent: React.FC<Props> = ({
  navigation,
  token_id,
  wallet_balance,
}) => {
  const [ amountStr, setAmountStr ] = useState<string>("");
  const [ feesSeparate, setFeesSeparate ] = useState<boolean>(false);
  const [ inputAdd, setInputAdd ] = useState("");
  const [ resultModal, setResultModal ] = useState<{
    status: "success" | "error" | null;
    message: string;
  }>({ status: null, message: "" });

  const { address, scanned } = useAppSelector((state) => state.scanWallet);
  const [ sendTransaction, { isLoading } ] = useSendTransactionMutation();
  const dispatch = useAppDispatch();

  const { clipboardContent, clearContent } = useAutoPaste({
    checkOnMount: true,
  });

  const numericAmount = useMemo(() => parseFloat(amountStr || "0"), [
    amountStr,
  ]);
  const numericBalance = useMemo(() => parseFloat(wallet_balance || "0"), [
    wallet_balance,
  ]);
  const hasInsufficientFunds = numericAmount > numericBalance;

  const isDisabled = !inputAdd.trim() ||
    numericAmount <= 0 ||
    isNaN(numericAmount) ||
    hasInsufficientFunds;

  useEffect(() => {
    setInputAdd("");
    setAmountStr("");
  }, []);

  useEffect(() => {
    if (clipboardContent) {
      console.log("clipboardContent", clipboardContent);
      if (!inputAdd) {
        setInputAdd(clipboardContent);
        clearContent();
      }
    }

  }, [ clipboardContent, clearContent, inputAdd ]);

  useEffect(() => {
    if (scanned && address) {
      setInputAdd(address);
      dispatch(setScanned(false));
      dispatch(clearScannedAddress());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ address, scanned ]);

  const handleAmountChange = (text: string) => {
    if (text.split(".").length > 2) return;
    if (/^\d*\.?\d*$/.test(text)) {
      setAmountStr(text);
    }
  };

  const handleSend = () => {
    if (isDisabled) return;

    Alert.alert(
      "Confirm Transaction",
      `You are sending ${amountStr} USDC to:\n${inputAdd}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          style: "destructive",
          onPress: confirmSend,
        },
      ],
    );
  };

  const confirmSend = async () => {
    try {
      await sendTransaction({
        amount: amountStr,
        destinationAddress: inputAdd.trim(),
        tokenId: token_id,
        destinationChain: "Solana",
        // separateFees: feesSeparate,
      }).unwrap();

      // Reset form
      setInputAdd("");
      setAmountStr("");

      clearContent();

      setResultModal({
        status: "success",
        message: "Transaction sent successfully.",
      });
    } catch (error: any) {
      const errorMessage = error?.data?.message ||
        error?.error ||
        "Transaction failed. Please try again.";

      setResultModal({
        status: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <View className="mt-8 px-6">
      <View className="flex-row items-center justify-between border-b border-gray-100 pb-2">
        <AppText className="text-[#14141480] text-[16px]">Send To</AppText>
        <View className="flex-1 mx-2">
          <TextInput
            numberOfLines={1}
            className="truncate w-full text-md text-black h-10"
            onChangeText={setInputAdd}
            value={inputAdd}
            placeholder="Wallet address"
            placeholderTextColor="#A0AEC0"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity
            className="bg-brand-700 px-5 py-3 rounded-full"
            onPress={() => navigation.replace("ScanWalletScreen", { from: "HomeSendScreen" })}
          >
            <AppText className="text-white font-bold text-[14px]">Scan</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row items-center justify-between border-b border-gray-100 mt-10 pb-2">
        <AppText className="text-[#14141480] text-[16px]">Amount</AppText>

        <TextInput
          value={amountStr}
          onChangeText={handleAmountChange}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#A0AEC0"
          className={`text-4xl text-center font-medium font-montserrat flex-1 mx-2 ${hasInsufficientFunds ? "text-red-700" : "text-blackAlpha-400"
            }`}
        />

        <View className="flex-row items-center">
          <View className="h-6 w-6 p-1 mr-2 border border-brand-700 rounded-full items-center justify-center">
            <View className="h-4 w-4 bg-brand-700 rounded-full" />
          </View>
          <AppText className="text-[#172A2B99] text-[16px]">USDC</AppText>
        </View>
      </View>

      <View className="h-8 mt-4 flex items-center justify-center">
        {hasInsufficientFunds && (
          <AppText className="text-red-700 text-sm text-center">
            Insufficient balance (Available: {wallet_balance})
          </AppText>
        )}
      </View>

      <View className="flex-row items-center justify-center mt-6 mb-16">
        <CheckBox
          value={feesSeparate}
          onValueChange={setFeesSeparate}
          className="rounded-none"
          boxType="square"
          tintColors={{ true: "#215ce1", false: "#C0C0C0" }}
          onCheckColor="white"
          onFillColor="#215ce1"
          onTintColor="#215ce1"
        />
        <AppText className="ml-3 text-brand-700 text-lg font-medium">
          Detect fees separately
        </AppText>
      </View>

      <ButtonComponent
        label="Send"
        onPress={handleSend}
        isLoading={isLoading}
        className="self-center"
        isDisabled={isDisabled}
        width="w-1/2"
      />

      <Modal
        visible={!!resultModal.status}
        transparent
        animationType="fade"
        onRequestClose={() => setResultModal({ status: null, message: "" })}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-8">
          <View className="bg-white w-full p-6 rounded-2xl items-center shadow-lg">
            <View
              className={`h-12 w-12 rounded-full items-center justify-center mb-4 ${resultModal.status === "success" ? "bg-green-100" : "bg-red-100"
                }`}
            >
              {/* You can add an Icon here based on status */}
              <AppText className="text-xl">
                {resultModal.status === "success" ? "✓" : "!"}
              </AppText>
            </View>

            <AppText className="text-xl font-bold mb-2 text-center text-black">
              {resultModal.status === "success"
                ? "Success"
                : "Transaction Failed"}
            </AppText>

            <AppText className="text-md text-gray-500 text-center mb-6">
              {resultModal.message}
            </AppText>

            <ButtonComponent
              label="Close"
              width="w-full"
              onPress={() => setResultModal({ status: null, message: "" })}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SendComponent;
