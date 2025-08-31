import type React from 'react'

import { FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppText from '../typo/AppText';
import { TOKEN_ICONS } from "../../../assets/Web3Icons";
import { CurrencyDetailNavigationProp } from '../../types/types';


const CoinList = [
  { id: "arb", title: "arbitrum" },
  { id: "avax", title: "avalanche" },
  { id: "base", title: "base" },
  { id: "eth", title: "ethereum" },
  { id: "linea", title: "linea" },
  { id: "codx", title: "codx" },
  { id: "op", title: "optimism" },
  { id: "matic", title: "polygon" },
  { id: "sei", title: "sei" },
  { id: "uni", title: "uniswap" },
  { id: "world", title: "world" },
]

const ActiveNetworkList: React.FC = () => {
  const navigation = useNavigation<CurrencyDetailNavigationProp>()

  const renderItem = ({ item }: { item: { id: string; title: string } }) => {
    const Icon = TOKEN_ICONS[ item.title ]
    return (
      <TouchableOpacity onPress={() => navigation.navigate("CurrencyDetail", { currency: item.title })} className='bg-gray-200 w-full rounded-xl items-center pl-3 flex-row py-5 my-3 h-20'>
        <Icon width={40} height={40} />
        <AppText className='uppercase ml-4 text-xl font-bold'>{item.id}</AppText>
      </TouchableOpacity>
    )
  };

  return <FlatList data={CoinList} className='w-full mb-1' renderItem={renderItem} keyExtractor={(item) => item.id} />
}

export default ActiveNetworkList