import React from "react";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { TouchableOpacity, View } from "react-native";
import FormInput from "../FormInput";
import AppText from "../typo/AppText";
import { useForgetPasswordMutation } from "../../service/endpoints/auth-endpoints";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props {
  setAllow: React.Dispatch<React.SetStateAction<boolean>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const StartForgotPassword: React.FC<Props> = ({ setAllow, setEmail }) => {
  const { control, handleSubmit, formState: { isValid } } = useForm<
    PasswordForm
  >();

  const [requestPassword, { isLoading }] = useForgetPasswordMutation();

  const handlePassword: SubmitHandler<PasswordForm> = async (value) => {
    try {
      const req = await requestPassword(value.email).unwrap();
      setEmail(value.email);
      console.log("req", req);
      setAllow(false);
    } catch (error) {
      console.log("error", error);
      setAllow(false);
    }
  };

  return (
    <View className="w-full px-6 justify-start items-center flex-1">
      <FormInput
        name="email"
        label="Email Address"
        placeholder="Enter Email Address"
        leftIcon={
          <MaterialIcons
            name="mail"
            size={20}
            color="gray"
          />
        }
        control={control}
        keyboardType="email-address"
        rules={{
          required: "Email is required",
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        }}
      />
      <TouchableOpacity
        className="self-end"
        disabled={!isValid || isLoading}
        onPress={handleSubmit(handlePassword)}
      >
        <AppText
          className={`${
            !isValid || isLoading ? "text-gray-400" : "text-brand-700"
          } self-end underline  text-lg mb-10 pr-5`}
        >
          Send Code
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export default StartForgotPassword;
