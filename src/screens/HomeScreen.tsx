import type React from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import { View } from 'react-native';
import HeaderComponent from '../components/layouts/HeaderComponent';
import USDCCardDesign from '../components/Main/USDCCardDesign';
import FiatDesign from '../components/Main/FiatDesign';

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const HomeScreen: React.FC<Props> = ({}) => {
  return (
    <View className="flex-1 bg-white px-6">
      <HeaderComponent />
      <USDCCardDesign />
      <FiatDesign />
    </View>
  );
};

export default HomeScreen;
