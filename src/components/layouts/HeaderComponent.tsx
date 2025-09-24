import type React from "react";

import { Image, TouchableOpacity, View } from "react-native";

import AppText from "../typo/AppText";
import MenuPopover from "../utils/MenuPopOver";
import { useNavigation } from "@react-navigation/native";
import { FullNavStack } from "../../types/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppSelector } from "../../store/redux";
import { useEffect } from "react";
import { useLazyGetUserProfileQuery } from "../../service/endpoints/user-endpoints";

const HeaderComponent: React.FC = () => {
  const navigate = useNavigation<NativeStackNavigationProp<FullNavStack>>();
  const [getProfile] = useLazyGetUserProfileQuery();
  const { profile } = useAppSelector((state) => state.user);
  useEffect(() => {
    const handleGetProfile = async () => {
      if (profile === null) {
        await getProfile().unwrap();
      }
    };
    handleGetProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);
  return (
    <View className="flex-row items-center justify-between px-4 pt-12">
      <TouchableOpacity
        onPress={() => navigate.navigate("ProfileScreen")}
        className="flex-row items-center"
      >
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          className="w-12 h-12 rounded-full"
        />
        <AppText className="ml-3 text-brand-600 font-semibold">
          @{profile?.username}
        </AppText>
      </TouchableOpacity>
      <View className="flex-row items-center space-x-3">
        <TouchableOpacity className="p-2 rounded-full">
          <Image source={require("../../../assets/blue_sphare.png")} />
        </TouchableOpacity>
        <MenuPopover />
      </View>
    </View>
  );
};

export default HeaderComponent;
