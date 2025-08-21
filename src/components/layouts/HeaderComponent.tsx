import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import type React from 'react';
import { Image, View } from 'react-native';

const HeaderComponent: React.FC = () => {
  return (
    <View className="mt-20 flex flex-row justify-between items-center">
      <Image
        source={require('../../../assets/blue_logo.png')}
        width={40}
        height={40}
        resizeMode="contain"
      />
      <View className="flex flex-row items-center pr-3">
        <Image
          source={require('../../../assets/blue_sphare.png')}
          className="mx-2"
        />
        <FontAwesome6
          name="ellipsis"
          iconStyle="solid"
          size={30}
          color="#215CE1"
        />
      </View>
    </View>
  );
};

export default HeaderComponent;
