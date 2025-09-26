import React from "react";

import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ButtonComponent from "../components/Button";
import AppText from "../components/typo/AppText";
import { useAppSelector } from "../store/redux";

const HomeSendScreen: React.FC = () => {
  const { active_wallet_address } = useAppSelector((state) => state.wallet);
  console.log("active_wallet_address", active_wallet_address);
  return (
    <>
      <View className="bg-white w-full flex-1 justify-center items-center">
        <View className="justify-center items-center px-6">
          {active_wallet_address && (
            <QRCode
              value={active_wallet_address}
              size={200}
              backgroundColor="white"
              color="black"
            />
          )}
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
