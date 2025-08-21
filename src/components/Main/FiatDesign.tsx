import type React from 'react';
import { View } from 'react-native';
import AppText from '../typo/AppText';

const FiatDesign: React.FC = () => {
  return (
    <View className="h-24 bg-brand-700 flex-row justify-between rounded-2xl p-5">
      <View>
        <AppText weight="light" className="font-light text-gray-300">
          Total Balance In fiat
        </AppText>
        <AppText weight="bold" className="text-white text-3xl">
          € 2,090.00
        </AppText>
      </View>
      <View className="bg-white shadow py-4 w-auto items-center justify-center px-3 rounded-full">
        <AppText weight="regular" className="text-brand-700 text-lg">
          Send Or Request
        </AppText>
      </View>
    </View>
  );
};

export default FiatDesign;
