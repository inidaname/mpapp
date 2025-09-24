import type React from "react";
import { View } from "react-native";
import Back from "../typo/Back";
import AppText from "../typo/AppText";

interface Props {
  heading: string;
  isWithBack?: boolean;
  Icon?: React.ReactNode;
}

const HeaderSide: React.FC<Props> = ({ heading, isWithBack, Icon }) => {
  return (
    <View
      className={`mt-20 w-full flex-row items-center ${Icon ? "pr-6" : ""}`}
    >
      {isWithBack && <Back />}
      <View className="flex-1 items-center justify-between">
        <AppText weight="medium" className="text-3xl mt-0">{heading}</AppText>
      </View>
      {Icon}
    </View>
  );
};

export default HeaderSide;
