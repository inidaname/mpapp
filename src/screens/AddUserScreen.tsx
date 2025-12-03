/* eslint-disable react-hooks/exhaustive-deps */
import type React from "react";

import {
  FlatList,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderSide from "../components/Main/HeaderSide";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
// import SecuredCheck from "../../assets/green_check.svg";
import AppText from "../components/typo/AppText";
import {
  useAddContactMutation,
  useGetContactsQuery,
  useLazyGetContactsQuery,
} from "../service/endpoints/contacts-endpoints";
import Avatar from "../components/Avatar";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";
import { useAppDispatch, useAppSelector } from "../store/redux";
import {
  setScanned,
  setScannedAddress,
} from "../store/reducers/scan-wallet-slice";
import { useNavigation } from "@react-navigation/native";
import { useRefreshUserAndWallet } from "../hooks/useRefreshProfileAndWallet";

interface FormUserData {
  first_name: string;
  last_name: string;
  chain: string;
  address: string;
}

type Props = NativeStackScreenProps<FullNavStack>;

const ListContacts: React.FC<{ search: string }> = ({ search }) => {
  const [getContact, { data, isLoading }] = useLazyGetContactsQuery();
  const { refetch } = useGetContactsQuery({ search });
  const navigation = useNavigation<NativeStackNavigationProp<FullNavStack>>();
  const dispatch = useAppDispatch();
  const { onRefresh, refreshing } = useRefreshUserAndWallet(refetch);

  useEffect(() => {
    getContact({ search });
  }, [search]);

  const sendToWallet = (address: string) => {
    dispatch(setScannedAddress(address));
    navigation.navigate("Home", {
      screen: "Send",
      params: { wallet_address: address },
    });
  };

  const contacts = data?.data?.contacts ?? [];
  const empty = !isLoading && contacts.length === 0;

  const renderItem = ({ item }: { item: any }) => (
    <View
      key={item.id}
      className="p-4 bg-gray-400/20 rounded-2xl my-2 flex-row justify-start items-center"
    >
      <View className="flex-1 flex-row justify-between items-center">
        <View className="relative w-16 mr-4">
          <Avatar name={`${item.first_name} ${item.last_name}`} />
        </View>

        <View className="flex-1 h-full">
          <View className="w-full flex-row justify-between items-end">
            <AppText
              weight="bold"
              ellipsizeMode="tail"
              numberOfLines={1}
              className="w-full truncate text-xl flex-1"
            >
              {item.first_name} {item.last_name}
            </AppText>

            <AppText className="w-full text-brand-700 text-sm w-20">
              {item.chain}
            </AppText>
          </View>

          <AppText
            ellipsizeMode="tail"
            numberOfLines={1}
            className="w-full truncate"
          >
            {item.address}
          </AppText>
        </View>

        <Pressable
          onPress={() => sendToWallet(item.address)}
          className="h-10 w-20 rounded-full justify-center items-center bg-brand-700"
        >
          <AppText className="text-white text-sm">Send</AppText>
        </Pressable>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View className="w-full px-6 mt-6 justify-center items-center">
        <AppText>Loading Contacts ...</AppText>
      </View>
    );
  }

  if (empty) {
    return (
      <View className="w-full px-6 mt-6 justify-center items-center">
        <AppText>You have no contacts added</AppText>
      </View>
    );
  }

  return (
    <FlatList
      data={contacts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      className="w-full px-6 mt-6"
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

const AddUserScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { address, scanned } = useAppSelector((state) => state.scanWallet);
  const [addContact, { isLoading }] = useAddContactMutation();
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormUserData>({
    defaultValues: {
      first_name: "",
      last_name: "",
      chain: "",
      address: address ?? "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (scanned && !open) {
      setOpen(true);
      dispatch(setScanned(false));
    }
  }, [scanned, open]);

  const onSubmit: SubmitHandler<FormUserData> = async (data) => {
    try {
      await addContact(data).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
      reset();
    }
  };
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
          value={search}
          onChangeText={(e) => setSearch(e)}
        />
      </View>
      {/* TODO: FLat list considered */}
      <ListContacts search={search} />
      <View className="w-full justify-center items-center mt-6">
        <Pressable
          className="flex-row items-center justify-center"
          onPress={() => setOpen(true)}
        >
          <MaterialIcons name="add-circle" size={24} color={"#215CE1"} />
          <AppText className="text-brand-700 ml-1 text-xl">Add User</AppText>
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="w-11/12 bg-white p-6 rounded-xl">
            <AppText className="text-2xl font-semibold mb-4">Add User</AppText>

            {/* First Name */}
            <Controller
              control={control}
              name="first_name"
              rules={{ required: "First Name of the contact is required" }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    placeholder="First Name"
                    value={value}
                    onChangeText={onChange}
                    className="border border-gray-300 rounded-lg p-3 mb-3"
                  />
                  {errors.first_name && (
                    <AppText className="text-red-600 text-sm mt-1">
                      {errors.first_name.message}
                    </AppText>
                  )}
                </>
              )}
            />

            {/* Last Name */}
            <Controller
              control={control}
              name="last_name"
              rules={{ required: "Last Name of the contact is required" }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    placeholder="Last Name"
                    value={value}
                    onChangeText={onChange}
                    className="border border-gray-300 rounded-lg p-3 mb-3"
                  />
                  {errors.last_name && (
                    <AppText className="text-red-600 text-sm mt-1">
                      {errors.last_name.message}
                    </AppText>
                  )}
                </>
              )}
            />

            {/* Chain */}
            <Controller
              control={control}
              name="chain"
              rules={{ required: "Blockchain contact is required" }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    placeholder="Chain (solana, ethereum)"
                    value={value}
                    onChangeText={onChange}
                    className="border border-gray-300 rounded-lg p-3 mb-3"
                  />
                  {errors.chain && (
                    <AppText className="text-red-600 text-sm mt-1">
                      {errors.chain.message}
                    </AppText>
                  )}
                </>
              )}
            />

            {/* Address */}
            <Controller
              control={control}
              name="address"
              rules={{ required: "The wallet Address contact is required" }}
              render={({ field: { onChange, value } }) => (
                <>
                  <View className="flex-row items-center mb-6 justify-center gap-4">
                    <TextInput
                      placeholder="Wallet Address"
                      value={value}
                      onChangeText={onChange}
                      className="border border-gray-300 rounded-lg p-3  flex-1"
                    />
                    <TouchableOpacity
                      className="bg-brand-700 px-5 py-4 rounded-full"
                      onPress={() => {
                        setOpen(false);
                        navigation.navigate("ScanWalletScreen");
                      }}
                    >
                      <AppText className="text-white font-bold text-[16px]">
                        Scan
                      </AppText>
                    </TouchableOpacity>
                  </View>
                  {errors.address && (
                    <AppText className="text-red-600 text-sm mt-1">
                      {errors.address.message}
                    </AppText>
                  )}
                </>
              )}
            />

            <View className="flex-row justify-between">
              <Pressable
                className="px-4 py-3 rounded-lg bg-gray-300"
                onPress={() => {
                  setOpen(false);
                  reset();
                }}
              >
                <AppText>Cancel</AppText>
              </Pressable>

              <Pressable
                className={`px-4 py-3 rounded-lg ${
                  !isValid || isLoading ? "bg-brand-300" : "bg-brand-700"
                }`}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || isLoading}
              >
                <AppText className="text-white">Save</AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddUserScreen;
