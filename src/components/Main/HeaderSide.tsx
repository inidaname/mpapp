import type React from 'react';
import { View } from 'react-native'
import Back from '../typo/Back'
import AppText from '../typo/AppText'

interface Props {
  heading: string;
  isWithBack?: boolean;
}

const HeaderSide: React.FC<Props> = ({ heading, isWithBack }) => {
  return <View className='mt-20 w-full'>
    {isWithBack && <Back />}
    <View className='w-full items-center justify-between'>
      <AppText weight='medium' className='text-3xl mt-0'>{heading}</AppText>
    </View>
  </View>
}

export default HeaderSide