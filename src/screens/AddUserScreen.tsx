/* eslint-disable react-hooks/exhaustive-deps */
import type React from "react";

import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
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
  useLazySearchContactQuery,
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
import { generateUsername } from '../helpers/username';
import { isSolanaAddress, isWalletAddress } from '../helpers/is-wallet-address';

interface FormUserData {
  username: string
  chain?: string;
  address: string;
}

type Props = NativeStackScreenProps<FullNavStack>;

const ListContacts: React.FC<{ search: string }> = ({ search }) => {
  const [ getContact, { data, isLoading } ] = useLazyGetContactsQuery();
  const { refetch } = useGetContactsQuery({ search });
  const navigation = useNavigation<NativeStackNavigationProp<FullNavStack>>();
  const dispatch = useAppDispatch();
  const { onRefresh, refreshing } = useRefreshUserAndWallet(refetch);

  useEffect(() => {
    getContact({ search });
  }, [ search ]);

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
  const [ search, setSearch ] = useState("");
  const [ open, setOpen ] = useState(false);
  const [ resolved, setResolved ] = useState(false);
  const [ showChainField, setShowChainField ] = useState(false);

  const { address, scanned } = useAppSelector(state => state.scanWallet);
  const dispatch = useAppDispatch();

  const [ addContact, { isLoading } ] = useAddContactMutation();
  const [ searchContact ] = useLazySearchContactQuery();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    // getValues,
  } = useForm<FormUserData>({
    defaultValues: {
      username: "",
      address: "",
      chain: "",
    },
    mode: "onChange",
  });

  // -------------------------
  // Core resolver logic
  // -------------------------
  const resolveContact = async (value: string) => {
    try {
      const result = await searchContact(value).unwrap();

      // 1. Backend found a user (username lookup)
      if (result?.username && result?.address) {
        reset({
          username: result.username,
          address: result.address,
          chain: "",
        });

        setShowChainField(false);
        setResolved(true);
        return;
      }

      // 2. Wallet address provided
      if (isWalletAddress(value)) {
        const solana = isSolanaAddress(value);

        reset({
          username: generateUsername(),
          address: value,
          chain: solana ? "solana" : "",
        });

        setShowChainField(!solana);
        setResolved(true);
        return;
      }

      // 3. Username not found
      reset({
        username: value,
        address: "",
        chain: "",
      });

      setResolved(false);
      setShowChainField(false);
    } catch (err) {
      console.log(err);
    }
  };

  // -------------------------
  // Wallet scan handler
  // -------------------------
  useEffect(() => {
    if (scanned && address) {
      resolveContact(address);
      dispatch(setScanned(false));
      setOpen(true);
    }
  }, [ scanned, address ]);

  // -------------------------
  // Submit
  // -------------------------
  const onSubmit: SubmitHandler<FormUserData> = async data => {
    try {
      await addContact(data).unwrap();
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
      setResolved(false);
      setShowChainField(false);
      reset();
    }
  };

  return (
    <View className="flex-1 bg-white">
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerClassName='w-full flex-1'
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 justify-center items-center bg-black/40">
              <View className="w-11/12 bg-white p-6 rounded-xl">
                <AppText className="text-2xl font-semibold mb-4">
                  Add Contact
                </AppText>

                {/* Username */}
                <Controller
                  control={control}
                  name="username"
                  // rules={{ required: "Username is required" }}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextInput
                        placeholder="Username"
                        value={value}
                        onChangeText={onChange}
                        onBlur={() => {
                          if (value?.length >= 3) {
                            resolveContact(value);
                          }
                        }}
                        className="border border-gray-300 rounded-lg p-3 mb-3"
                      />
                      {errors.username && (
                        <AppText className="text-red-600 text-sm">
                          {errors.username.message}
                        </AppText>
                      )}
                    </>
                  )}
                />

                {/* Chain (conditional) */}
                {showChainField && (
                  <Controller
                    control={control}
                    name="chain"
                    rules={{ required: "Blockchain is required" }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextInput
                          placeholder="Chain (solana, ethereum)"
                          value={value}
                          onChangeText={onChange}
                          className="border border-gray-300 rounded-lg p-3 mb-3"
                        />
                        {errors.chain && (
                          <AppText className="text-red-600 text-sm">
                            {errors.chain.message}
                          </AppText>
                        )}
                      </>
                    )}
                  />
                )}

                {/* Address */}
                <Controller
                  control={control}
                  name="address"
                  rules={{ required: "Wallet address is required" }}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <View className="flex-row items-center gap-4 mb-6">
                        <TextInput
                          placeholder="Wallet Address"
                          value={value}
                          onChangeText={onChange}
                          className="border border-gray-300 rounded-lg p-3 flex-1"
                        />
                        <TouchableOpacity
                          className="bg-brand-700 px-5 py-4 rounded-full"
                          onPress={() => {
                            setOpen(false);
                            navigation.replace("ScanWalletScreen", {
                              from: "AddUserScreen",
                            });
                          }}
                        >
                          <AppText className="text-white font-bold">
                            Scan
                          </AppText>
                        </TouchableOpacity>
                      </View>
                      {errors.address && (
                        <AppText className="text-red-600 text-sm">
                          {errors.address.message}
                        </AppText>
                      )}
                    </>
                  )}
                />

                {/* Actions */}
                <View className="flex-row justify-between">
                  <Pressable
                    className="px-4 py-3 rounded-lg bg-gray-300"
                    onPress={() => {
                      setOpen(false);
                      setResolved(false);
                      setShowChainField(false);
                      reset();
                    }}
                  >
                    <AppText>Cancel</AppText>
                  </Pressable>

                  <Pressable
                    className={`px-4 py-3 rounded-lg ${!isValid || !resolved || isLoading
                      ? "bg-brand-300"
                      : "bg-brand-700"
                      }`}
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isValid || !resolved || isLoading}
                  >
                    <AppText className="text-white">Save</AppText>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default AddUserScreen;
