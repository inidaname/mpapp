import type React from "react";

import { TouchableOpacity, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OtpInput } from "react-native-otp-entry";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FullNavStack } from "../types/types";
import HeaderSide from "../components/Main/HeaderSide";
import AppText from "../components/typo/AppText";
import { SubmitHandler, useForm } from "react-hook-form";
import PhoneNumberInput from "../components/PhoneNumberInput";
import ButtonComponent from "../components/Button";
import {
  useChangePhoneMutation,
  useRequestPhoneMutation,
} from "../service/endpoints/auth-endpoints";
import { useEffect, useState } from "react";
import Checkbox from "@react-native-community/checkbox"

interface Props extends NativeStackScreenProps<FullNavStack> { }

const ChangePhoneScreen: React.FC<Props> = ({ navigation }) => {
  const { control, handleSubmit, watch, formState: { isValid } } = useForm<
    PhoneOTPInput
  >();
  const [ phoneNumber, setPhoneNumber ] = useState("");
  const [ otp, setOTP ] = useState("");
  const [ stillValid, setStillValid ] = useState(false);
  const [ requestPhone, { isLoading } ] = useRequestPhoneMutation();
  const [ changePhone, { isLoading: changingPhone } ] = useChangePhoneMutation();

  const handleChange: SubmitHandler<PhoneOTPInput> = async (values) => {
    try {
      await requestPhone(values.phoneNumber).unwrap();
      setPhoneNumber(values.phoneNumber);
      setStillValid(true);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleUpdate = async () => {
    if (otp.length < 4) return;
    try {
      await changePhone({ otp, phoneNumber }).unwrap();
      navigation.goBack();
    } catch (error) {
      console.log("error", error);
    }
  };

  const phoneValue = watch("phoneNumber");

  useEffect(() => {
    if (phoneNumber && phoneValue !== phoneNumber) {
      setStillValid(false);
    }
  }, [ phoneNumber, phoneValue ]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={40}
    >
      <View className="w-full flex-1 bg-white justify-between items-center">
        <View className="w-full">
          <HeaderSide heading="Change Phone Number" isWithBack />
          <AppText
            weight="light"
            className="px-6 text-center mt-8 font-light text-lg"
          >
            Enter your old phone number on which we can send you a verification
            code
          </AppText>
          <View className="px-6 w-full items-center mt-8">
            <PhoneNumberInput
              name="phoneNumber"
              control={control}
              label="Phone Number"
              rules={{ required: "Phone number required" }}
            />
            <View className='flex-row px-6 gap-x-4 mb-8 mt-4'>
              <Checkbox />
              <AppText>I consent to receive SMS notifications from Insfers Inc.</AppText>
            </View>
            <TouchableOpacity
              className="self-end mb-8"
              onPress={handleSubmit(handleChange)}
              disabled={isLoading || !isValid}
            >
              <AppText
                className={`underline text-lg ${isLoading || !isValid ? "text-gray-400" : "text-brand-700"
                  }`}
              >
                Send Code
              </AppText>
            </TouchableOpacity>

            {stillValid && (
              <OtpInput
                focusColor="#215ce1"
                numberOfDigits={4}
                onTextChange={(text) => setOTP(text)}
                theme={{
                  pinCodeContainerStyle: { width: 60, height: 60 },
                  containerStyle: { width: "90%", marginVertical: 20 },
                  pinCodeTextStyle: {
                    fontFamily: "Raleway-Regular",
                    fontSize: 20,
                  },
                }}
              />
            )}
          </View>
        </View>
        <View className="px-6 w-full">
          <ButtonComponent
            isDisabled={!stillValid || otp.length < 4 || changingPhone}
            label="Update"
            onPress={handleUpdate}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ChangePhoneScreen;
