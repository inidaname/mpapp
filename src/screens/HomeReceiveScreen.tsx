import React, { useState } from "react";

import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ButtonComponent from "../components/Button";
import AppText from "../components/typo/AppText";

const HomeSendScreen: React.FC = () => {
  const walletAddress = "12tsNYRjzZ3LcLyEvn4XJCB4FV12GbWU";
  return (
    <>
      <View className="bg-white w-full flex-1 justify-center items-center">
        <View className="justify-center items-center px-6">
          <QRCode
            value={walletAddress} // 👈 value encoded in QR
            size={200} // size in pixels
            backgroundColor="white"
            color="black"
          />
          <AppText className="text-center mt-6 text-lg">
            Scan this QR code or use the address below to receive USDC:
          </AppText>
        </View>
      </View>
      <View className="w-full px-6 bg-white mb-5">
        <ButtonComponent label="Send" />
      </View>
    </>
  );
};

export default HomeSendScreen;
