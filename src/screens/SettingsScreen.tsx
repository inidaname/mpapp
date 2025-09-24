import type React from "react";
import { useState } from "react";

import { ScrollView, Switch, View } from "react-native";
import HeaderSide from "../components/Main/HeaderSide";
import AppText from "../components/typo/AppText";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import Logout from "../components/utils/Logout";

interface Props {}

const SettingsScreen: React.FC<Props> = () => {
  const [isEnabled, setIsEnabled] = useState(false);
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
        <View className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="border-color" size={20} />
            <AppText className="ml-3">Edit Profile</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </View>
        <View className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="border-color" size={20} />
            <AppText className="ml-3">Change Password</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </View>
        <View className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="border-color" size={20} />
            <AppText className="ml-3">Change Phone Number</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </View>
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
        <View className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="more" size={20} />
            <AppText className="ml-3">4-Digit Security Pin</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </View>
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
        <View className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="wallet" size={20} />
            <AppText className="ml-3">Local Currency</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </View>
        <View className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="public" size={20} />
            <AppText className="ml-3">Country</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </View>
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
        <View className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="donut-small" size={20} />
            <AppText className="ml-3">FAQs</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </View>
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
        <View className="w-full px-3 py-4 bg-gray-200 mt-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <MaterialIcons name="library-books" size={20} />
            <AppText className="ml-3">Contact Us</AppText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={"#215CE1"} />
        </View>
        <View className="w-full px-3 py-4 bg-gray-200 mt-6 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center jusitfy-start">
            <View className="bg-red-600 rounded-full justify-center items-center p-2">
              <MaterialIcons name="delete" size={20} color={"white"} />
            </View>
            <AppText className="ml-3 text-red-600">Delete Account</AppText>
          </View>
        </View>
      </View>
      <Logout />
    </ScrollView>
  );
};

export default SettingsScreen;
