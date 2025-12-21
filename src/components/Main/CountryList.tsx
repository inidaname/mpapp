import React, { useState, useMemo } from "react";
import { View, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import AppText from '../typo/AppText';
import { useGetCountriesQuery } from '../../service/endpoints/util-endpoitns';

export interface Country {
  name: string;
  code: string;
}

interface CountryListProps {
  // countries: Country[];
  selectedCode?: string;
  onSelect: (country: Country) => void;
  searchPlaceholder?: string;
}

const CountryList: React.FC<CountryListProps> = ({
  // countries,
  selectedCode,
  onSelect,
  searchPlaceholder = "Search country...",
}) => {
  const [ searchQuery, setSearchQuery ] = useState("");
  const { data: countries, isLoading } = useGetCountriesQuery();


  // Memoize filtered results for performance
  const filteredCountries = useMemo(() => {
    if (!countries?.length) return;
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [ searchQuery, countries ]);

  const renderItem = ({ item }: { item: Country }) => {
    const isSelected = selectedCode === item.code;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row items-center justify-between w-full"
        onPress={() => onSelect(item)}
      >
        <View className="px-4 rounded-2xl my-2 py-4 justify-between items-center bg-gray-300/20 flex flex-row w-full">
          <View className="flex flex-row items-center flex-1">
            <Image
              className="w-10 h-10 rounded-full"
              source={{
                uri: `https://flagcdn.com/w40/${item.code.toLowerCase()}.png`,
              }}
            />
            <View className="ml-3 flex-shrink">
              <AppText weight="medium" className="text-lg uppercase">
                {item.name}
              </AppText>
              <AppText className="text-sm text-gray-500">{item.code}</AppText>
            </View>
          </View>

          {/* Radio Button UI */}
          <View
            className={`w-6 h-6 items-center justify-center rounded-full border ${isSelected ? "border-brand-500" : "border-gray-400"
              }`}
          >
            {isSelected && (
              <View className="w-3 h-3 bg-brand-500 rounded-full" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <View className="flex-1 justify-center items-center">
      <ActivityIndicator color="#000" />
    </View>
  }

  return (
    <View className="flex-1">
      {/* Search Input */}
      <View className="mb-4">
        <TextInput
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="bg-gray-100 px-4 py-3 rounded-xl text-black"
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredCountries}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true} // Performance boost for long lists
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View className="mt-10 items-center">
            <AppText className="text-gray-400">No countries found</AppText>
          </View>
        }
      />
    </View>
  );
};

export default CountryList;