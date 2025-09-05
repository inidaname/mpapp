import React from "react";

import { TouchableOpacity, View } from "react-native";

import AppText, { FigureText } from "../typo/AppText";

interface Props {
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  amount: string;
}

const KeyPad: React.FC<Props> = ({ setAmount, amount }) => {
  const handlePress = (val: string) => {
    if (val === "x") {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      setAmount((prev) => prev + val);
    }
  };
  return (
    <>
      <View className="items-center mb-4">
        <FigureText className="text-6xl font-semibold">
          ${amount || ""}
        </FigureText>
      </View>
      <View className="w-full border-t border-gray-200 my-1" />
      <AppText className="text-center text-gray-500 mb-2">
        Available Account Balance: $750.00
      </AppText>

      <View className="flex-row flex-wrap justify-center">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "x"].map((
          key,
        ) => (
          <TouchableOpacity
            key={key}
            onPress={() => handlePress(key)}
            className="w-1/4 mx-3 p-2 items-center justify-center"
          >
            <View className="bg-gray-100 w-24 h-16 rounded-2xl items-center justify-center">
              <FigureText className="text-2xl font-semibold">
                {key}
              </FigureText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default KeyPad;
