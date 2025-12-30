/* eslint-disable react-native/no-inline-styles */
import type React from "react";
import { useEffect, useState } from "react";

import { View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FullNavStack } from "../types/types";
import HeaderSide from "../components/Main/HeaderSide";
import FormInput from "../components/FormInput";
import { SubmitHandler, useForm } from "react-hook-form";
import ButtonComponent from "../components/Button";
import {
  useUpdateUserMutation,
} from "../service/endpoints/user-endpoints";
import { useAppSelector } from '../store/redux';
import AppText from '../components/typo/AppText';

interface Message {
  type: "success" | "error"
  message: string
}

interface Props extends NativeStackScreenProps<FullNavStack> { }

const EditProfileScreen: React.FC<Props> = () => {

  const [ message, setMessage ] = useState<Message | null>(null)
  const [ handleUpdate, { isLoading } ] = useUpdateUserMutation();
  const { profile } = useAppSelector(state => state.user)

  const { control, handleSubmit, setValue } = useForm<Partial<UserUpdate>>();
  // const { data } = useGetUserProfileQuery();

  useEffect(() => {
    setValue("username", profile?.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ profile?.username ]);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [ message ]);

  const handleForm: SubmitHandler<Partial<UserUpdate>> = async (values) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("country", profile?.country);
    formData.append("phone_number", profile?.phone_number);

    try {
      await handleUpdate(formData).unwrap();
      setMessage({ type: "success", message: "Your profile has been updated successfully." })
    } catch (error) {
      setMessage({ type: "error", message: "Profile update failed. Please try again." })
      console.log("error", error);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={40}
    >
      <View className="w-full flex-1 bg-white justify-between">
        <View className="w-full">
          <HeaderSide heading="Edit Profile" isWithBack />

          <View className="w-full px-6 mt-8">
            <FormInput
              control={control}
              name="username"
              label="Username"
              leftIcon={<MaterialIcons name="person" size={20} />}
              placeholder="Enter Your Username"
            />
            {message && <AppText className={message.type === "error" ? "text-red-600" : "text-green-600"}>{message.message}</AppText>}
          </View>
        </View>
        <View className="bottom-0 px-6">
          <ButtonComponent
            label="Update"
            isLoading={isLoading}
            onPress={handleSubmit(handleForm)}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default EditProfileScreen;
