import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
// import { twMerge } from 'tailwind-merge';
import { Country } from "../../types/types";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
  apiUrl: string;
}

const CountryPickerModal: React.FC<Props> = (
  { visible, onClose, onSelect, apiUrl },
) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiUrl);
      setCountries(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (visible) {
      fetchCountries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const renderItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      onPress={() => {
        onSelect(item);
        onClose();
      }}
      className="flex-row items-center px-4 py-2 border-b border-gray-200"
    >
      <Text className={`fi fi-${item.code.toLowerCase()} mr-2`} />
      <Text className="text-base">{item.name} (+{item.dial_code})</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 p-4">
        <TouchableOpacity onPress={onClose} className="mb-4">
          <Text className="text-blue-500">Close</Text>
        </TouchableOpacity>

        {loading
          ? <ActivityIndicator size="large" className="mt-20" />
          : (
            <FlatList
              data={countries}
              renderItem={renderItem}
              keyExtractor={(item) => item.code}
            />
          )}
      </View>
    </Modal>
  );
};

export default CountryPickerModal;
