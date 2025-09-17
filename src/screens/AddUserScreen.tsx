import type React from "react";
import { Image, Pressable, TextInput, View } from "react-native";
import HeaderSide from "../components/Main/HeaderSide";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import SecuredCheck from "../../assets/green_check.svg";
import AppText from "../components/typo/AppText";

const AddUserScreen: React.FC = () => {
  return (
    <View className="flex-1 w-full bg-white">
      <HeaderSide heading="Add User" isWithBack />
      <View className="px-6 mt-6 relative justify-start w-full justify-center items-center">
        <View className="absolute left-9">
          <MaterialIcons
            name="search"
            size={30}
            color={"#215CE1"}
          />
        </View>
        <TextInput
          className="rounded-lg p-4 bg-gray-400/20 pl-12 w-full"
          keyboardType="web-search"
        />
      </View>
      {/* TODO: FLat list considered */}
      <View className="w-full px-6 mt-6">
        <View className="p-4 bg-gray-400/20 rounded-2xl flex-row justify-start items-center">
          <View className="relative w-16 mr-4">
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              className="w-14 h-14 rounded-full"
            />
            <View className="absolute -bottom-1 right-0">
              <SecuredCheck
                width={20}
                height={20}
              />
            </View>
          </View>
          <View className="flex-1 h-full">
            <AppText weight="bold" className="w-full text-xl">
              Maria Gomez
            </AppText>
            <AppText className="w-full">
              mgomez23TXN1234567890
            </AppText>
          </View>
        </View>
      </View>
      <View className="w-full justify-center items-center mt-6">
        <Pressable className="flex-row items-center justify-center">
          <MaterialIcons name="add-circle" size={24} color={"#215CE1"} />
          <AppText className="text-brand-700 ml-1 text-xl">Add User</AppText>
        </Pressable>
      </View>
    </View>
  );
};

export default AddUserScreen;
