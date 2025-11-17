/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from "react";

import { View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { FullNavStack } from "../types/types";
import HeaderSide from "../components/Main/HeaderSide";
import FormInput from "../components/FormInput";
import { SubmitHandler, useForm } from "react-hook-form";
import ButtonComponent from "../components/Button";
import { useChangePasswordMutation } from "../service/endpoints/auth-endpoints";

interface Props extends NativeStackScreenProps<FullNavStack> {}

interface FormField extends ChangePassword {
  confirm_password: string;
}

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { control, watch, handleSubmit, formState: { isValid } } = useForm<
    FormField
  >();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const password = watch("newPassword");

  const handleForm: SubmitHandler<FormField> = async (values) => {
    const { confirm_password, ...rest } = values;
    try {
      await changePassword(rest).unwrap();
      navigation.goBack();
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
              name="oldPassword"
              label="Old Password"
              leftIcon={<MaterialIcons name="lock" size={20} />}
              placeholder="Enter Password"
              isPassword
              rules={{ required: "Old Password is required" }}
            />
          </View>
          <View className="w-full px-6 mt-8">
            <FormInput
              control={control}
              name="newPassword"
              label="New Password"
              leftIcon={<MaterialIcons name="lock" size={20} />}
              placeholder="Enter Password"
              isPassword
              rules={{ required: "Provide a new password" }}
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
              rules={{
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
            />
          </View>
        </View>
        <View className="bottom-0 px-6">
          <ButtonComponent
            label="Update"
            isDisabled={!isValid || isLoading}
            onPress={handleSubmit(handleForm)}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default EditProfileScreen;
