import type React from 'react';
import { Image, View } from 'react-native';
import AppText from '../typo/AppText';

const USDCCardDesign: React.FC = () => {
  return (
    <View className="w-full h-[186px] bg-gray-300/50 my-5 relative rounded-xl p-4">
      <View className="flex-1 justify-between">
        <Image source={require('../../../assets/blue_usdc_logo.png')} />
        <View>
          <AppText weight="bold" className="text-4xl">
            $ 2,803.12
          </AppText>
          <AppText weight="light" className="font-thin text-md">
            Total Balance In USDC
          </AppText>
        </View>
      </View>
      <Image
        source={require('../../../assets/blue_squares.png')}
        className="absolute right-0 top-0"
        resizeMode="contain"
      />
    </View>
  );
};

export default USDCCardDesign;
