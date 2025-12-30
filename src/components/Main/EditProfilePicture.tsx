import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { useAppSelector } from '../../store/redux';
import { useUpdateUserMutation } from '../../service/endpoints/user-endpoints';
const EditProfilePicture: React.FC = () => {
  const [ photo, setPhoto ] = useState<any>(null);
  const [ assign, setAssign ] = useState<string | null>(null);
  const [ loading, setLoading ] = useState(false);

  const { profile } = useAppSelector(state => state.user);
  const [ handleUpdate ] = useUpdateUserMutation();

  // Resize image when picked
  useEffect(() => {
    if (!photo?.uri) return;

    const resizeImage = async () => {
      try {
        let uri = photo.uri;

        if (!uri.startsWith('file://')) {
          uri = `file://${uri}`;
        }

        const resized = await ImageResizer.createResizedImage(
          uri,
          400,
          400,
          'JPEG',
          70
        );

        setAssign(resized.uri);
      } catch (err) {
        console.error('Image resize failed', err);
      }
    };

    resizeImage();
  }, [ photo?.uri ]);

  // Upload AFTER resize
  useEffect(() => {
    if (!assign) return;

    const upload = async () => {
      setLoading(true);

      const formData = new FormData();

      formData.append('file', {
        uri: assign,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);

      formData.append('username', profile?.username ?? '');
      formData.append('country', profile?.country ?? '');
      formData.append('phone_number', profile?.phone_number ?? '');

      try {
        await handleUpdate(formData).unwrap();
      } catch (e) {
        console.log('Upload error', e);
      } finally {
        setLoading(false);
      }
    };

    upload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ assign ]);

  const pickImage = async () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel || response.errorCode) return;

      const asset = response.assets?.[ 0 ];
      if (!asset?.uri) return;

      setPhoto({ uri: asset.uri });
    });
  };

  return (
    <View className="w-full justify-center items-center mt-5">
      {loading && <ActivityIndicator style={styles.loader} />}

      <TouchableOpacity onPress={pickImage}>
        {(assign || profile?.profile_image) ? (
          <FastImage
            style={{ width: 144, height: 144, borderRadius: 72 }}
            source={{ uri: assign ?? profile?.profile_image }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View className="rounded-full border w-36 h-36 items-center justify-center">
            <MaterialIcons name="person" size={55} />
          </View>
        )}

        <View className="absolute right-0 top-0 bg-brand-700 rounded-full h-10 w-10 items-center justify-center">
          <MaterialIcons name="border-color" color="white" size={12} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfilePicture

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  loader: {
    position: 'absolute',
  },
});