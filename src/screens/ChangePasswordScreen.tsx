import type React from "react";
import { useState } from "react";

import { Image, TouchableOpacity, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import { FullNavStack } from "../types/types";
import HeaderSide from "../components/Main/HeaderSide";
import FormInput from "../components/FormInput";
import { useForm } from "react-hook-form";
import ButtonComponent from "../components/Button";

interface Props extends NativeStackScreenProps<FullNavStack> {}

const EditProfileScreen: React.FC<Props> = () => {
  const { control } = useForm();

  return (
    <View className="w-full flex-1 bg-white justify-between">
      <View className="w-full">
        <HeaderSide heading="Edit Profile" isWithBack />
        <View className="w-full px-6 mt-8">
          <FormInput
            control={control}
            name="old_password"
            label="Old Password"
            leftIcon={<MaterialIcons name="lock" size={20} />}
            placeholder="Enter Password"
            isPassword
          />
        </View>
        <View className="w-full px-6 mt-8">
          <FormInput
            control={control}
            name="new_password"
            label="New Password"
            leftIcon={<MaterialIcons name="lock" size={20} />}
            placeholder="Enter Password"
            isPassword
          />
        </View>
        <View className="w-full px-6 mt-8">
          <FormInput
            control={control}
            name="confirm_password"
            label="Confirm New Password"
            leftIcon={<MaterialIcons name="lock" size={20} />}
            placeholder="Enter Password"
            isPassword
          />
        </View>
      </View>
      <View className="bottom-0 px-6">
        <ButtonComponent label="Update" />
      </View>
    </View>
  );
};

export default EditProfileScreen;
