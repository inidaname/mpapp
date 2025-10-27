import type React from "react";
import { useEffect } from "react";

import { Image, TouchableOpacity, View } from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AppText from "../typo/AppText";
import MenuPopover from "../utils/MenuPopOver";
import { useNavigation } from "@react-navigation/native";
import { FullNavStack } from "../../types/types";
import { useAppSelector } from "../../store/redux";
import { useLazyGetUserProfileQuery } from "../../service/endpoints/user-endpoints";
import Avatar from "../Avatar";

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
        <Avatar name={profile?.username} uri={profile?.profile_image} />
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
