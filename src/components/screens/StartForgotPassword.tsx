import React from "react";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { TouchableOpacity, View } from "react-native";
import FormInput from "../FormInput";
import AppText from "../typo/AppText";
import { useForgetPasswordMutation } from "../../service/endpoints/auth-endpoints";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props {
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<"start" | "verify">>
}

const StartForgotPassword: React.FC<Props> = ({
  setDisabled,
  setEmail,
  setStep
}) => {
  const { control, handleSubmit, formState } =
    useForm<PasswordForm>({
      mode: "onChange",
    });

  const [ requestPassword, { isLoading } ] =
    useForgetPasswordMutation();

  const onSubmit: SubmitHandler<PasswordForm> = async ({
    email,
  }) => {
    try {
      await requestPassword(email).unwrap();
      setEmail(email);
      setDisabled(false);
      setStep("verify")
    } catch (error) {
      console.log("forgot error", error);
      setStep("verify")
    }
  };

  return (
    <View className="w-full px-6 items-center flex-1">
      <FormInput
        name="email"
        label="Email Address"
        placeholder="Enter Email Address"
        control={control}
        keyboardType="email-address"
        rules={{
          required: "Email is required",
          pattern: {
            value:
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Invalid email address",
          },
        }}
        leftIcon={
          <MaterialIcons name="mail" size={20} color="gray" />
        }
      />

      <TouchableOpacity
        className="self-end"
        disabled={!formState.isValid || isLoading}
        onPress={handleSubmit(onSubmit)}
      >
        <AppText
          className={`${!formState.isValid || isLoading
            ? "text-gray-400"
            : "text-brand-700"
            } underline text-lg mb-10 pr-5`}
        >
          Send Code
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export default StartForgotPassword;
