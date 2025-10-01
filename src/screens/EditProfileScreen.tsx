import type React from "react";
import { useState } from "react";

import { Image, TouchableOpacity, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { launchImageLibrary } from "react-native-image-picker";

import { FullNavStack } from "../types/types";
import HeaderSide from "../components/Main/HeaderSide";
import FormInput from "../components/FormInput";
import { useForm } from "react-hook-form";
import ButtonComponent from "../components/Button";

interface Props extends NativeStackScreenProps<FullNavStack> {}

const EditProfileScreen: React.FC<Props> = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const { control } = useForm();
  const pickImage = async () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.error("ImagePicker Error:", response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        if (uri) setPhoto(uri);
      }
    });
  };
  return (
    <View className="w-full flex-1 bg-white justify-between">
      <View className="w-full">
        <HeaderSide heading="Edit Profile" isWithBack />
        <View className="w-full justify-center items-center mt-10">
          <TouchableOpacity
            onPress={pickImage}
          >
            {photo
              ? (
                <Image
                  source={{ uri: photo }}
                  className="w-36 h-36 rounded-full"
                  // style={{
                  //   width: 150,
                  //   height: 150,
                  //   borderRadius: 75,
                  //   marginVertical: 10,
                  // }}
                />
              )
              : (
                <View className="rounded-full relative items-center justify-center border border-gray-300 w-36 h-36">
                  <MaterialIcons name="person" size={55} />
                </View>
              )}
            <View className="absolute justify-center items-center right-0 top-0 bg-brand-700 rounded-full h-10 w-10">
              <MaterialIcons name="border-color" color={"white"} size={12} />
            </View>
          </TouchableOpacity>
        </View>
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
        <ButtonComponent label="Update" />
      </View>
    </View>
  );
};

export default EditProfileScreen;
