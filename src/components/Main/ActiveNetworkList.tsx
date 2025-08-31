import type React from 'react'
import { FlatList, View } from 'react-native';
import AppText from '../typo/AppText';
import { TOKEN_ICONS } from "../../../assets/Web3Icons";


const CoinList = [
  { id: "arb", title: "arbitrum" },
  { id: "avax", title: "avalanche" },
  { id: "base", title: "base" },
  { id: "eth", title: "ethereum" },
  { id: "linea", title: "linea" },
  { id: "codx", title: "codx" },
  { id: "matic", title: "polygon" },
  { id: "world", title: "world" },
  { id: "uni", title: "uniswap" },
  { id: "op", title: "optimism" },
  { id: "sei", title: "sei" },

]

const ActiveNetworkList: React.FC = () => {
  const renderItem = ({ item }: { item: { id: string; title: string } }) => {
    const Icon = TOKEN_ICONS[ item.title ]
    return (
      <View className='bg-gray-300 w-full rounded-xl items-center pl-3 flex-row py-5 my-2 h-20'>
        <Icon width={40} height={40} />
        <AppText className='uppercase ml-4 text-xl font-bold'>{item.id}</AppText>
      </View>
    )
  };

  return <FlatList data={CoinList} className='w-full mb-10' renderItem={renderItem} keyExtractor={(item) => item.id} />
}

export default ActiveNetworkList