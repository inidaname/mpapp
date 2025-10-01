/* eslint-disable react-native/no-inline-styles */
import type React from "react";
import { useState } from "react";

import {
  Modal,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderSide from "../components/Main/HeaderSide";
import AppText from "../components/typo/AppText";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import Logout from "../components/utils/Logout";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";
import { OtpInput } from "react-native-otp-entry";
import ButtonComponent from "../components/Button";

interface Props extends NativeStackScreenProps<FullNavStack> {}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [pinVisible, setPinVisible] = useState(false);
  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      contentContainerClassName="bg-white flex-col justify-start items-start"
      keyboardShouldPersistTaps="handled"
    >
      <HeaderSide heading="Settings" isWithBack />
      <View className="w-full px-6 mt-6">
        <AppText className="text-gray-600 text-sm">
          General Setting
        </AppText>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfileScreen")}
          className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center"
        >
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="border-color" size={20} />
            <AppText className="ml-3">Edit Profile</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChangePasswordScreen")}
          className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center"
        >
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="border-color" size={20} />
            <AppText className="ml-3">Change Password</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChangePhoneScreen")}
          className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center"
        >
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="border-color" size={20} />
            <AppText className="ml-3">Change Phone Number</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </TouchableOpacity>
        <View className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="border-color" size={20} />
            <AppText className="ml-3">Notification</AppText>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#215CE1" }}
            thumbColor={"#ffffff"}
            onValueChange={toggleSwitch}
            value={isEnabled}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </View>
      <View className="w-full px-6 mt-12">
        <AppText className="text-gray-600 text-sm">
          Security Setting
        </AppText>
        <TouchableOpacity
          onPress={() => setPinVisible(true)}
          className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center"
        >
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="more" size={20} />
            <AppText className="ml-3">4-Digit Security Pin</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </TouchableOpacity>
        <View className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="fingerprint" size={20} />
            <AppText className="ml-3">Biometric</AppText>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#215CE1" }}
            thumbColor={"#ffffff"}
            onValueChange={toggleSwitch}
            value={isEnabled}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </View>
      <View className="w-full px-6 mt-12">
        <AppText className="text-gray-600 text-sm">
          Preference
        </AppText>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChangeCountry")}
          className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center"
        >
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="wallet" size={20} />
            <AppText className="ml-3">Local Currency</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChangeCountry")}
          className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center"
        >
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="public" size={20} />
            <AppText className="ml-3">Country</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </TouchableOpacity>
        {
          /* <View className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="fingerprint" size={20} />
            <AppText className="ml-3">Dark Mode</AppText>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#215CE1" }}
            thumbColor={"#ffffff"}
            onValueChange={toggleSwitch}
            value={isEnabled}
            ios_backgroundColor="#3e3e3e"
          />
        </View> */
        }
      </View>
      <View className="w-full px-6 mt-12">
        <AppText className="text-gray-600 text-sm">
          Resources
        </AppText>
        <TouchableOpacity
          onPress={() => navigation.navigate("FAQScreen")}
          className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center"
        >
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="donut-small" size={20} />
            <AppText className="ml-3">FAQs</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </TouchableOpacity>
        <View className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="library-books" size={20} />
            <AppText className="ml-3">Terms and Conditions</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </View>
        <View className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="library-books" size={20} />
            <AppText className="ml-3">Privacy Policy</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("ContactUsScreen")}
          className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center"
        >
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="library-books" size={20} />
            <AppText className="ml-3">Contact Us</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDeleteAccountVisible(true)}
          className="w-full px-3 py-4 bg-gray-200 mt-6 rounded-lg flex-row justify-between items-center"
        >
          <View className="flex-1 flex-row items-center jusitfy-start">
            <View className="bg-red-600 rounded-full justify-center items-center p-2">
              <MaterialIcons name="delete" size={20} color={"white"} />
            </View>
            <AppText className="ml-3 text-red-600">Delete Account</AppText>
          </View>
        </TouchableOpacity>
      </View>
      <Logout />
      <Modal
        visible={pinVisible}
        animationType="slide"
        transparent
        allowSwipeDismissal
      >
        <View className="flex-1 justify-center items-center w-full px-6 bg-black/30">
          <View className="bg-white rounded-2xl p-6 w-full relative items-center">
            <TouchableOpacity
              onPress={() => setPinVisible(false)}
              className="self-end"
            >
              <MaterialIcons name="close" />
            </TouchableOpacity>
            <View className="w-full items-center">
              <AppText weight="bold" className="text-xl">
                Create 4-Digit Pin
              </AppText>
              <AppText className="text-center mt-4">
                Create 4 digit pin code to secure your account
              </AppText>

              <OtpInput
                focusColor="#215ce1"
                numberOfDigits={4}
                onTextChange={(text) => console.log(text)}
                theme={{
                  pinCodeContainerStyle: { width: 60, height: 60 },
                  containerStyle: { width: "90%", marginVertical: 20 },
                  pinCodeTextStyle: {
                    fontFamily: "Raleway-Regular",
                    fontSize: 20,
                  },
                }}
              />

              <View className="mt-4 w-full">
                <ButtonComponent
                  label="Continue"
                  onPress={() => setPinVisible(false)}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={deleteAccountVisible}
        animationType="slide"
        transparent
        allowSwipeDismissal
      >
        <View className="flex-1 justify-center items-center w-full px-6 bg-black/30">
          <View className="bg-white rounded-2xl p-6 w-full relative items-center">
            <TouchableOpacity
              onPress={() => setDeleteAccountVisible(false)}
              className="self-end"
            >
              <MaterialIcons name="close" />
            </TouchableOpacity>
            <View className="p-4 bg-gray-100 items-center justify-center rounded-full">
              <View className="p-4 bg-brand-700 items-center justify-center rounded-full">
                <MaterialIcons name="priority-high" color={"white"} size={30} />
              </View>
            </View>

            <View className="w-full items-center">
              <AppText className="text-base text-2xl font-semibold">
                Delete Account
              </AppText>
              <AppText className="text-center">
                Are you sure you want to delete your account? it would never
                undo again
              </AppText>
            </View>

            <View className="flex-row w-full justify-between items-center mt-8">
              <TouchableOpacity className="flex-1 border border-brand-700 bg-white mr-2 justify-center py-4 rounded-2xl">
                <AppText className="text-brand-700 text-center">Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-brand-700 ml-2 justify-center py-4 rounded-2xl">
                <AppText className="text-white text-center font-bold">
                  Delete
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SettingsScreen;
