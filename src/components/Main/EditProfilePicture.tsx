import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { useAppSelector } from '../../store/redux';
import { useUpdateUserMutation } from '../../service/endpoints/user-endpoints';

const EditProfilePicture: React.FC = () => {
  const [ photo, setPhoto ] = useState<UserUpdate[ "file" ] | null>(null);
  const [ assign, setAssign ] = useState("")
  const { profile } = useAppSelector(state => state.user)
  const [ handleUpdate ] = useUpdateUserMutation();


  useEffect(() => {

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
          console.error('ImageResizer Error:', err);
        }
      } else {
        console.log('Photo URI was falsy');
      }
    };

    resizeImage();
  }, [ photo?.uri ]);
  useEffect(() => {
    const handleForm = async () => {
      if (!photo?.uri) return;

      const formData = new FormData();
      formData.append("file", {
        uri: photo.uri,
        name: photo.fileName,
        type: photo.fileType,
      } as any);
      formData.append("username", profile?.username);
      formData.append("country", profile?.country);
      formData.append("phone_number", profile?.phone_number);

      try {
        const update = await handleUpdate(formData).unwrap();
        console.log("update", update);
      } catch (error) {
        console.log("error", error);
      }
    }

    handleForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ photo?.fileName, photo?.fileType, photo?.uri ])

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


  return (
    <View className="w-full justify-center items-center mt-5">
      <TouchableOpacity
        onPress={pickImage}
      >
        {photo || profile?.profile_image
          ? (
            <FastImage
              style={{ width: 144, height: 144, borderRadius: 72 }}
              source={{
                uri: assign ? assign : profile?.profile_image,
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
  )
}

export default EditProfilePicture