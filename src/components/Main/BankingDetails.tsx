import type React from "react";

import { TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import AppText from "../typo/AppText";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FullNavStack } from "../../types/types";
import ExternalAccountList from "./ExternalAccountList";

interface Props {
  text: string;
}

const BankingDetails: React.FC<Props> = ({ text }) => {
  const navigate = useNavigation<NativeStackNavigationProp<FullNavStack>>();

  const goToAccounts = () => { navigate.navigate("AddBankScreen") }

  return (
    <>
      <View className="w-full flex-row justify-between items-center p-6">
        <AppText weight="medium" className="text-lg">
          {text}
        </AppText>
        <TouchableOpacity
          onPress={goToAccounts}
          className="flex-row items-center p-2 justify-start"
        >
          <View className="bg-brand-700 rounded-full p-1">
            <MaterialIcons
              name="add"
              size={20}
              color="white"
            />
          </View>
          <AppText
            weight="medium"
            className="text-brand-700 ml-3 text-md"
          >
            Add New
          </AppText>
        </TouchableOpacity>
      </View>
      <ExternalAccountList selectable />
    </>
  );
};

export default BankingDetails;
