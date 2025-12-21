/* eslint-disable react-native/no-inline-styles */
import type React from "react";
import { useEffect } from "react";

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



interface Props extends NativeStackScreenProps<FullNavStack> { }

const EditProfileScreen: React.FC<Props> = () => {

  const [ handleUpdate, { isLoading } ] = useUpdateUserMutation();
  const { profile } = useAppSelector(state => state.user)

  const { control, handleSubmit, setValue } = useForm<Partial<UserUpdate>>();
  // const { data } = useGetUserProfileQuery();

  useEffect(() => {
    setValue("username", profile?.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ profile?.username ]);

  const handleForm: SubmitHandler<Partial<UserUpdate>> = async (values) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("country", profile?.country);
    formData.append("phone_number", profile?.phone_number);

    try {
      const update = await handleUpdate(formData).unwrap();
      console.log("update", update);
    } catch (error) {
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
