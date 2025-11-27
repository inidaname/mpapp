import type React from "react";

import { FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppText from "../typo/AppText";
import { TOKEN_ICONS } from "../../../assets/Web3Icons";
import { CurrencyDetailNavigationProp } from "../../types/types";
import { useGetActiveNetworksQuery } from "../../service/endpoints/transactions-endpoints";

// const CoinList = [
//   { id: "arb", title: "arbitrum" },
//   { id: "avax", title: "avalanche" },
//   { id: "base", title: "base" },
//   { id: "eth", title: "ethereum" },
//   { id: "linea", title: "linea" },
//   { id: "codx", title: "codx" },
//   { id: "op", title: "optimism" },
//   { id: "matic", title: "polygon" },
//   { id: "sei", title: "sei" },
//   { id: "uni", title: "uniswap" },
//   { id: "world", title: "world" },
// ];

function stripAfterUnderscore(str: string) {
  const index = str.indexOf("_");
  return index === -1 ? str : str.slice(0, index);
}

const ActiveNetworkList: React.FC = () => {
  const navigation = useNavigation<CurrencyDetailNavigationProp>();
  const { data } = useGetActiveNetworksQuery();

  return (
    <FlatList
      data={data?.data.activeNetworks ?? []}
      className="w-full mb-1"
      renderItem={({ item }) => {
        const displayName = stripAfterUnderscore(item);
        const Icon = TOKEN_ICONS[displayName.toLowerCase()];
        console.log("Icons", Icon);
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CurrencyDetail", { currency: item })}
            className="bg-gray-200 w-full rounded-xl items-center pl-3 flex-row py-5 my-3 h-20"
          >
            {Icon && <Icon width={40} height={40} />}
            <AppText className="uppercase ml-4 text-xl font-bold">
              {displayName}
            </AppText>
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item) => item}
    />
  );
};

export default ActiveNetworkList;
