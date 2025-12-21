/* eslint-disable react-native/no-inline-styles */
import type React from "react";
import { useEffect, useState } from "react";

import { TouchableOpacity, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { launchImageLibrary } from "react-native-image-picker";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FullNavStack } from "../types/types";
import HeaderSide from "../components/Main/HeaderSide";
import FormInput from "../components/FormInput";
import { SubmitHandler, useForm } from "react-hook-form";
import ButtonComponent from "../components/Button";
import {
  useGetUserProfileQuery,
  useUpdateUserMutation,
} from "../service/endpoints/user-endpoints";
import FastImage from 'react-native-fast-image';
import ImageResizer from '@bam.tech/react-native-image-resizer';


interface Props extends NativeStackScreenProps<FullNavStack> { }

const EditProfileScreen: React.FC<Props> = () => {
  const [ photo, setPhoto ] = useState<UserUpdate[ "file" ] | null>(null);
  const [ assign, setAssign ] = useState("")
  const [ handleUpdate, { isLoading } ] = useUpdateUserMutation();

  const { control, handleSubmit, setValue } = useForm<Partial<UserUpdate>>();
  const { data } = useGetUserProfileQuery();

  useEffect(() => {
    // 1. Log to see if the effect even runs
    console.log('Effect triggered. Photo URI:', photo?.uri);

    const resizeImage = async () => {
      if (photo?.uri) {
        let uri = photo.uri;
        if (!uri.startsWith('file://') && !uri.startsWith('http')) {
          uri = `file://${uri}`;
        }

        uri = uri.replace(/ /g, '%20');

        try {

          const assignedURI = await ImageResizer.createResizedImage(
            uri,
            400,
            400,
            'JPEG',
            70,
            0,
            undefined,
            false,
            {
              mode: 'contain',
              onlyScaleDown: false,
            }
          );

          setAssign(assignedURI.uri);
        } catch (err) {
          // 2. Catch hidden errors (invalid path, library crash, etc)
          console.error('ImageResizer Error:', err);
        }
      } else {
        console.log('Photo URI was falsy');
      }
    };

    resizeImage();
  }, [ photo?.uri ]);

  useEffect(() => {
    setValue("username", data?.data.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data?.data.username ]);

  const pickImage = async () => {
    await launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error:", response.errorMessage);
      } else {
        const uri = response.assets?.[ 0 ]?.uri;
        const fileName = response.assets?.[ 0 ]?.fileName!;
        const fileType = response.assets?.[ 0 ]?.type!;
        if (uri) setPhoto({ uri, fileName, fileType });
      }
    });
  };

  console.log('assign', assign)

  const handleForm: SubmitHandler<Partial<UserUpdate>> = async (values) => {
    if (!photo?.uri) return;

    const formData = new FormData();
    formData.append("file", {
      uri: photo.uri,
      name: photo.fileName,
      type: photo.fileType,
    } as any);
    formData.append("username", values.username);
    formData.append("country", data?.data.country);
    formData.append("phone_number", "+2348123456789");

    try {
      const update = await handleUpdate(formData).unwrap();
      console.log("update", update);
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
          <View className="w-full justify-center items-center mt-10">
            <TouchableOpacity
              onPress={pickImage}
            >
              {photo || data?.data.profile_image
                ? (
                  <FastImage
                    style={{ width: 144, height: 144, borderRadius: 72 }}
                    source={{
                      uri: assign ? assign : data?.data.profile_image,
                      priority: FastImage.priority.normal,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
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
          <ButtonComponent
            label="Update"
            isLoading={isLoading}
            onPress={handleSubmit(handleForm)}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default EditProfileScreen;
