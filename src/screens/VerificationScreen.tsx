/* eslint-disable react-native/no-inline-styles */
import type React from "react";
import { FullNavStack } from "../types/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import AppText from "../components/typo/AppText";
import PhoneNumberInput from "../components/PhoneNumberInput";
import { SubmitHandler, useForm } from "react-hook-form";
import Back from "../components/typo/Back";
import {
  useChangePhoneMutation,
  useRequestPhoneMutation,
  useResendOTPMutation,
  useVerifyOTPMutation,
} from "../service/endpoints/auth-endpoints";
import ButtonComponent from "../components/Button";
// import { useLazyGetCountriesQuery } from "../service/endpoints/util-endpoitns";
import {
  useLazyGetUserProfileQuery,
  useUpdateUserMutation,
} from "../service/endpoints/user-endpoints";
import { saveToken } from "../helpers/token-helper";
import { useAppDispatch, useAppSelector } from "../store/redux";
import {
  clearTempToken,
  setTokenTempe,
} from "../store/reducers/temporary-slice";
import { setToken } from "../store/reducers/auth-slice";
import { useCreateWalletMutation } from "../service/endpoints/wallets-endpoints";
import { getCountry } from 'react-native-localize';
import CountryList from '../components/Main/CountryList';

interface Props
  extends NativeStackScreenProps<FullNavStack, "VerificationScreen"> { }
interface ChildProps extends Pick<Props, "navigation"> {
  onContinue: () => void;
  onSelectCountry?: (item: CountriesAPI) => void;
}

interface EmailScreenProp extends Pick<ChildProps, "onContinue"> {
  email: string;
  login: boolean;
}

const { width } = Dimensions.get("window");

const EmailVerification: React.FC<EmailScreenProp> = ({
  onContinue,
  email,
  login,
}) => {
  const [ otp, setOTP ] = useState("");
  const [ countdown, setCountdown ] = useState(60);
  const [ canResend, setCanResend ] = useState(login);
  const [ verifyOTP, { isLoading } ] = useVerifyOTPMutation();
  const [ createWallet ] = useCreateWalletMutation();
  const [ resend ] = useResendOTPMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let timer: number;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [ countdown ]);

  const handleResend = async () => {
    try {
      await resend({ email }).unwrap();

      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (otp.length === 4) {
        const otpdetail = await verifyOTP({ email, otp }).unwrap();
        await saveToken(otpdetail.data.accessToken);
        if (!login) {
          dispatch(setTokenTempe(otpdetail.data.accessToken));
          onContinue();
        } else {
          dispatch(
            setToken({
              token: otpdetail.data.accessToken,
              user_id: otpdetail.data.id,
            }),
          );
          dispatch(clearTempToken());
        }
        await createWallet({
          accountType: "EOA",
          blockchains: [ "SOL-DEVNET" ],
        }).unwrap();
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
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
          <View className="w-full flex-row items-center justify-center mt-2">
            <AppText>
              Resend code in <AppText>{formatTime(countdown)}</AppText>
            </AppText>

            <TouchableOpacity
              className="ml-3"
              disabled={!canResend}
              onPress={handleResend}
            >
              <AppText
                className={`${canResend ? "text-brand-700" : "text-gray-400"
                  }  underline text-xl`}
              >
                Resend OTP
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <ButtonComponent
          label="Continue"
          isLoading={isLoading}
          onPress={handleVerifyOTP}
          isDisabled={otp.length < 4}
        />
      </View>
    </ScrollView>
  );
};

const PhoneVerification: React.FC<Pick<ChildProps, "onContinue">> = ({
  onContinue,
}) => {
  const [ otp, setOTP ] = useState("");
  const { control, handleSubmit, watch, formState: { isValid } } = useForm<
    Partial<UserUpdate>
  >();
  const [ update, { isLoading } ] = useRequestPhoneMutation();
  const [ changePhone, { isLoading: changingPhone } ] = useChangePhoneMutation();
  const [ countdown, setCountdown ] = useState(60);
  const [ canResend, setCanResend ] = useState(false);
  const [ submitted, setSubmitted ] = useState(false);
  const [ phoneNumber, setPhoneNumber ] = useState("");
  // const [stillValid, setStillValid] = useState(false);

  const phoneValue = watch("phone_number");

  useEffect(() => {
    if (phoneNumber && phoneValue !== phoneNumber) {
      setSubmitted(false);
    }
  }, [ phoneNumber, phoneValue ]);

  useEffect(() => {
    let timer: number;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [ countdown ]);

  const handlAddPhone: SubmitHandler<Partial<UserUpdate>> = async (values) => {
    if (!values.phone_number) return;
    try {
      const addPhone = await update(values.phone_number)
        .unwrap();
      setSubmitted(true);
      setPhoneNumber(values.phone_number);
      console.log("addPhone", addPhone);
    } catch (error) {
      console.log("error", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmitOTP = async () => {
    await changePhone({ otp, phoneNumber });
    onContinue();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
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
            name="phone_number"
            control={control}
            label="Phone Number"
            rules={{ required: "Phone number is required" }}
          />
          <View className="w-full justify-center items-end pr-6">
            {submitted
              ? (
                <View className="flex-row items-center justify-center mt-2">
                  <AppText>
                    Resend code in <AppText>{formatTime(countdown)}</AppText>
                  </AppText>

                  <TouchableOpacity
                    className="ml-3"
                    disabled={(!canResend && !isValid) || isLoading}
                    onPress={handleSubmit(handlAddPhone)}
                  >
                    <AppText
                      className={`${(canResend && isValid) || !isLoading
                        ? "text-brand-700"
                        : "text-gray-400"
                        }  underline`}
                    >
                      Resend Code
                    </AppText>
                  </TouchableOpacity>
                </View>
              )
              : (
                <TouchableOpacity
                  disabled={!isValid}
                  onPress={handleSubmit(handlAddPhone)}
                >
                  <AppText
                    className={`${!isValid ? "text-gray-400" : "text-brand-700"
                      } underline my-2`}
                  >
                    Send Code
                  </AppText>
                </TouchableOpacity>
              )}
          </View>
          {submitted && (
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
        <ButtonComponent
          label="Continue"
          isLoading={changingPhone}
          onPress={handleSubmitOTP}
          isDisabled={otp.length < 4 || !submitted}
        />
      </View>
    </ScrollView>
  );
};

const CountrySelect: React.FC<Omit<ChildProps, "onContinue">> = () => {
  const countryName = getCountry()
  const [ selected, setSelected ] = useState<Pick<CountriesAPI, "code" | "name"> | null>(null);
  const [ update, { isLoading: updating } ] = useUpdateUserMutation();
  const { token, user_id } = useAppSelector((state) => state.tempSlice);
  const [ getProfil ] = useLazyGetUserProfileQuery();

  const dispatch = useAppDispatch();



  useEffect(() => {
    setSelected({ code: countryName, name: countryName })
  }, [ countryName ])


  const handleSubmit = async () => {
    try {
      console.log(selected);
      const user = await getProfil().unwrap();
      await update({
        country: selected?.name,
        username: user?.data.username,
      }).unwrap();

      dispatch(setToken({ token, user_id }));
      dispatch(clearTempToken());
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View className="flex-1 px-4">
      <Text className="text-2xl font-bold text-center my-4">
        Select Country
      </Text>
      {/* <ScrollView> */}
      <View className="flex-1 mt-6">
        <CountryList
          selectedCode={selected?.code}
          onSelect={(country) => setSelected(country)}
        />
      </View>
      {/* </ScrollView> */}
      <ButtonComponent
        isDisabled={!selected}
        onPress={handleSubmit}
        isLoading={updating}
        label="Continue"
      />
      {
        /* <TouchableOpacity
        disabled={!selected}
        onPress={handleContinue}
        className={`w-full px-6 py-3 rounded-2xl h-16 justify-center items-center mb-10 ${
          selected ? "bg-brand-700" : "bg-brand-300"
        }`}
      >
        <AppText weight="semibold" className="text-white text-xl">
          Continue
        </AppText>
      </TouchableOpacity> */
      }
    </View>
  );
};

const VerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const [ step, setStep ] = useState(0);
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="w-full bg-white flex-1">
        <View className="w-full flex flex-row justify-between items-center mt-20">
          <Back />
          <View className="flex flex-row justify-center items-center mx-auto">
            {[ 0, 1, 2 ].map((i) => (
              <View
                key={i}
                className={`h-2 w-20 mx-1 rounded-full ${step >= i ? "bg-brand-400" : "bg-gray-300"
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
            transform: [ { translateX } ],
          }}
        >
          <View style={{ width }}>
            <EmailVerification
              email={route.params.email}
              login={route.params.login}
              onContinue={goNext}
            />
          </View>
          <View style={{ width }}>
            <PhoneVerification onContinue={goNext} />
          </View>
          <View style={{ width }}>
            <CountrySelect
              navigation={navigation}
            />
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VerificationScreen;
