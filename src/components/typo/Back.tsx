import type React from "react";

import { TouchableOpacity } from "react-native";

import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { useNavigation } from "@react-navigation/native";

const Back: React.FC = () => {
  const { goBack } = useNavigation();
  return (
    <TouchableOpacity
      className="absolute left-0 ml-2 py-2 px-3"
      onPress={() => goBack()}
    >
      <MaterialIcons
        name="chevron-left"
        size={20}
        color="#215ce1"
      />
    </TouchableOpacity>
  );
};

export default Back;
