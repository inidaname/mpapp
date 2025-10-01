/* eslint-disable react-native/no-inline-styles */
import type React from "react";
import { FullNavStack } from "../types/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRef, useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import AppText from "../components/typo/AppText";
import PhoneNumberInput from "../components/PhoneNumberInput";
import { useForm } from "react-hook-form";
import Back from "../components/typo/Back";
import { useSendOTPMutation } from "../service/endpoints/auth-endpoints";
import ButtonComponent from "../components/Button";
import { useGetCountriesQuery } from "../service/endpoints/util-endpoitns";

interface Props
  extends NativeStackScreenProps<FullNavStack, "VerificationScreen"> {}
interface ChildProps extends Pick<Props, "navigation"> {
  onContinue: () => void;
  onSelectCountry: (item: CountriesAPI) => void;
}

interface EmailScreenProp extends Pick<ChildProps, "onContinue"> {
  email: string;
}

const { width } = Dimensions.get("window");

const EmailVerification: React.FC<EmailScreenProp> = ({
  onContinue,
  email,
}) => {
  const [otp, setOTP] = useState("");
  const [sendOTP, { isLoading }] = useSendOTPMutation();
  const handleSendOTP = async () => {
    try {
      if (otp.length === 4) {
        const otpdetail = await sendOTP({ email, otp }).unwrap();
        console.log("otpdetail", otpdetail);
        onContinue();
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  return (
    <View className="flex-1 items-center justify-between px-6">
      <View className="w-full items-center mt-10">
        <View className="h-36" />
        <AppText weight="medium" className="text-3xl mb-2">
          Email Verification
        </AppText>
        <View className="mb-6">
          <AppText
            weight="light"
            className="text-center text-lg font-light mb-2"
          >
            We have sent you a verification code to your given email
          </AppText>
          <AppText className="text-center text-lg">{email}</AppText>
        </View>
        <OtpInput
          focusColor="#215ce1"
          numberOfDigits={4}
          onTextChange={(text) => setOTP(text)}
          theme={{
            pinCodeContainerStyle: { width: 60, height: 60 },
            containerStyle: { width: "90%", marginVertical: 20 },
            pinCodeTextStyle: { fontFamily: "Raleway-Regular", fontSize: 20 },
          }}
        />
        <AppText className="text-brand-700 underline text-xl mt-2">
          Resend code
        </AppText>
      </View>
      <ButtonComponent
        label="Continue"
        isLoading={isLoading}
        onPress={handleSendOTP}
        isDisabled={otp.length < 4}
      />
    </View>
  );
};

const PhoneVerification: React.FC<Pick<ChildProps, "onContinue">> = ({
  onContinue,
}) => {
  const { control } = useForm();
  return (
    <View className="flex-1 items-center justify-between px-4">
      <View className="w-full items-center mt-10">
        <Image
          source={require("../../assets/phone_question.png")}
          className="my-6"
        />
        <AppText weight="semibold" className="text-2xl mb-2">
          Phone Verification
        </AppText>
        <AppText className="text-center text-lg mb-6">
          Enter your phone number on which we can send you a verification code
        </AppText>
        <PhoneNumberInput
          name="phone"
          control={control}
          label="Phone Number"
          rules={{ required: "Phone number required" }}
        />
        <View className="w-full justify-center items-end pr-6">
          <AppText className="underline text-brand-700 my-2">
            Resend Code
          </AppText>
        </View>
        <OtpInput
          focusColor="#215ce1"
          numberOfDigits={4}
          onTextChange={(text) => console.log(text)}
          theme={{
            pinCodeContainerStyle: { width: 60, height: 60 },
            containerStyle: { width: "90%", marginVertical: 20 },
            pinCodeTextStyle: { fontFamily: "Raleway-Regular", fontSize: 20 },
          }}
        />
      </View>
      <TouchableOpacity
        onPress={onContinue}
        className="bg-brand-700 w-full px-6 py-3 rounded-2xl h-16 justify-center items-center mb-10"
      >
        <AppText weight="semibold" className="text-white text-xl">
          Continue
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const CountrySelect: React.FC<Omit<ChildProps, "onContinue">> = ({
  navigation,
  onSelectCountry,
}) => {
  const [selected, setSelected] = useState<CountriesAPI | null>(null);

  const { data: countries, isLoading } = useGetCountriesQuery();

  const handleContinue = () => {
    if (selected) {
      onSelectCountry(selected);
      navigation.navigate("Home");
    }
  };

  if (isLoading) {
    return <AppText>Loading Countries</AppText>;
  }

  return (
    <View className="flex-1 px-4">
      <Text className="text-2xl font-bold text-center my-4">
        Select Country
      </Text>
      <ScrollView>
        {countries?.map((country) => (
          <TouchableOpacity
            key={country.code}
            className="flex-row items-center justify-between py-0 w-full"
            onPress={() => setSelected(country)}
          >
            <View className="px-4 rounded-2xl my-4 py-4 justify-between items-center bg-gray-300/20 flex flex-row w-full">
              <View className="flex flex-row items-center">
                <Image
                  className="w-10 h-10 rounded-full"
                  source={{
                    uri:
                      `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`,
                  }}
                />
                <AppText weight="medium" className="text-xl uppercase mx-2">
                  {country.name}
                </AppText>
                <AppText className="text-2xl text-gray-500">
                  {country.code}
                </AppText>
              </View>
              <View
                className={`w-8 h-8 items-center justify-center rounded-full ${
                  selected?.code === country.code
                    ? "border border-brand-500"
                    : "border border-gray-400"
                }`}
              >
                {selected?.code === country.code && (
                  <View
                    className={`w-4 h-4 items-center justify-center border-brand-500 bg-brand-500 rounded-full`}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        disabled={!selected}
        onPress={handleContinue}
        className={`w-full px-6 py-3 rounded-2xl h-16 justify-center items-center mb-10 ${
          selected ? "bg-brand-700" : "bg-brand-300"
        }`}
      >
        <AppText weight="semibold" className="text-white text-xl">
          Continue
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const VerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const [step, setStep] = useState(0);
  const [_, onSelectCountry] = useState<CountriesAPI | null>(null);
  const translateX = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    Animated.timing(translateX, {
      toValue: -(step + 1) * width,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setStep((prev) => prev + 1);
  };

  return (
    <View className="w-full bg-white flex-1">
      <View className="w-full flex flex-row justify-between items-center mt-20">
        <Back />
        <View className="flex flex-row justify-center items-center mx-auto">
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              className={`h-2 w-20 mx-1 rounded-full ${
                step >= i ? "bg-brand-400" : "bg-gray-300"
              }`}
            />
          ))}
        </View>
      </View>
      <Animated.View
        style={{
          flexDirection: "row",
          width: width * 3,
          flex: 1,
          transform: [{ translateX }],
        }}
      >
        <View style={{ width }}>
          <EmailVerification email={route.params.email} onContinue={goNext} />
        </View>
        <View style={{ width }}>
          <PhoneVerification onContinue={goNext} />
        </View>
        <View style={{ width }}>
          <CountrySelect
            onSelectCountry={onSelectCountry}
            navigation={navigation}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default VerificationScreen;
