import React, { useState } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";
import {
  useGetUserProfileQuery,
  useUpdateUserMutation,
} from "../service/endpoints/user-endpoints";
import HeaderSide from "../components/Main/HeaderSide";
import ButtonComponent from "../components/Button";
import CountryList, { Country } from "../components/Main/CountryList"; // Import your new component

interface Props extends NativeStackScreenProps<FullNavStack> { }

const ChangeCountry: React.FC<Props> = ({ navigation }) => {
  const [ selected, setSelected ] = useState<Country | null>(null);

  const { data: user } = useGetUserProfileQuery();
  const [ update, { isLoading: updating } ] = useUpdateUserMutation();

  const handleContinue = async () => {
    if (!selected) return;
    try {
      await update({
        country: selected.name,
        username: user?.data.username,
      }).unwrap();
      navigation.goBack();
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  return (
    <View className="flex-1 px-4 bg-white">
      <HeaderSide heading="Country" isWithBack />


      <View className="flex-1 mt-6">
        <CountryList
          selectedCode={selected?.code}
          onSelect={(country) => setSelected(country)}
        />
      </View>


      <View className="pb-6">
        <ButtonComponent
          label="Continue"
          onPress={handleContinue}
          isDisabled={!selected}
          isLoading={updating}
        />
      </View>
    </View>
  );
};

export default ChangeCountry;