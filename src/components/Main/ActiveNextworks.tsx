import type React from 'react'
import { View } from 'react-native'

import AppText from '../typo/AppText'
import ActiveNetworkList from './ActiveNetworkList'

const ActiveNetworks: React.FC = () => {
  return <View className='flex-1 w-full justify-start mt-12 px-2 items-start'>
    <AppText className='text-2xl mb-4'>Active Network</AppText>
    <ActiveNetworkList />
  </View>
}

export default ActiveNetworks