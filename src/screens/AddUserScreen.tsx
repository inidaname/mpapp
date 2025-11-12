import type React from "react";
import { useMemo } from "react";
import { TextInput, View } from "react-native";
import HeaderSide from "../components/Main/HeaderSide";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
// import SecuredCheck from "../../assets/green_check.svg";
import AppText from "../components/typo/AppText";
import { useGetContactsQuery } from "../service/endpoints/contacts-endpoints";
import Avatar from "../components/Avatar";

const ListContacts: React.FC = () => {
  const { data, isLoading } = useGetContactsQuery(1);

  if (isLoading) {
    return (
      <View className="w-full px-6 mt-6 justify-center items-center">
        <AppText>Loading Contacts ...</AppText>
      </View>
    );
  }

  if (data?.data && data.data.totalCount <= 0) {
    return (
      <View className="w-full px-6 mt-6 justify-center items-center">
        <AppText>You have no contacts added</AppText>
      </View>
    );
  }

  return (
    <View className="w-full px-6 mt-6">
      {data?.data.contacts.map((contact) => (
        <View
          key={contact.id}
          className="p-4 bg-gray-400/20 rounded-2xl flex-row justify-start items-center"
        >
          <View className="relative w-16 mr-4">
            <Avatar name={`${contact.first_name} ${contact.last_name}`} />
          </View>
          <View className="flex-1 h-full">
            <AppText weight="bold" className="w-full text-xl">
              {contact.first_name} {contact.last_name}
            </AppText>
            <AppText className="w-full">
              {contact.address}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
};

const AddUserScreen: React.FC = () => {
  return (
    <View className="flex-1 w-full bg-white">
      <HeaderSide heading="Add User" isWithBack />
      <View className="px-6 mt-6 relative justify-start w-full justify-center items-center">
        <View className="absolute left-9">
          <MaterialIcons
            name="search"
            size={30}
            color={"#215CE1"}
          />
        </View>
        <TextInput
          className="rounded-lg p-4 bg-gray-400/20 pl-12 w-full"
          keyboardType="web-search"
        />
      </View>
      {/* TODO: FLat list considered */}
      <ListContacts />
      {
        /* <View className="w-full justify-center items-center mt-6">
        <Pressable className="flex-row items-center justify-center">
          <MaterialIcons name="add-circle" size={24} color={"#215CE1"} />
          <AppText className="text-brand-700 ml-1 text-xl">Add User</AppText>
        </Pressable>
      </View> */
      }
    </View>
  );
};

export default AddUserScreen;
