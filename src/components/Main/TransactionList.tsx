import MaterialIcons from "@react-native-vector-icons/material-icons";
import type React from "react";
import { View } from "react-native";
import AppText, { FigureText } from "../typo/AppText";
import { useGetTransactionQuery } from "../../service/endpoints/transactions-endpoints";

const Transactions: React.FC = () => {
  const { data } = useGetTransactionQuery({});
  return (
    <View className="w-full justify-start items-center mt-4">
      {data?.data.map((transaction) => (
        <View
          key={transaction.id}
          className="bg-white w-full py-4 px-4 flex-row rounded-xl items-center justify-start my-3"
        >
          <View className="w-16 h-16 rounded-full bg-[#215CE11A] items-center justify-center mr-4">
            <MaterialIcons
              name="south-west"
              size={40}
              color={"#215CE1"}
            />
          </View>
          <View className="flex-1 justify-between flex-row items-center">
            <View className="flex-1">
              <AppText
                numberOfLines={1}
                ellipsizeMode="tail"
                weight="light"
                className="text-2xl text-gray-900 truncate w-1/2"
              >
                {transaction.recipient_address}
              </AppText>
              <AppText className="text-gray-400">
                {new Date(transaction.created_at).toLocaleDateString()}
              </AppText>
            </View>
            <View className="items-end">
              <FigureText weight="bold" className="text-2xl text-gray-900">
                $ {transaction.amount}
              </FigureText>
              {/* <FigureText className="text-gray-400">100 USD</FigureText> */}
            </View>
          </View>
        </View>
      ))}
      {
        /* <View className="bg-white w-full py-4 px-4 flex-row rounded-xl items-center justify-start my-3">
        <View className="w-16 h-16 rounded-full bg-[#FF23231A] items-center justify-center mr-4">
          <MaterialIcons
            name="north-east"
            size={40}
            color={"#FF2323"}
          />
        </View>
        <View className="flex-1 justify-between flex-row items-center">
          <View>
            <AppText weight="light" className="text-2xl text-gray-900">
              John Doe
            </AppText>
            <AppText className="text-gray-400">
              Apr 10, 2024 09:20 AM
            </AppText>
          </View>
          <View className="items-end">
            <FigureText weight="bold" className="text-2xl text-gray-900">
              $ 150
            </FigureText>
            <FigureText className="text-gray-400">100 USD</FigureText>
          </View>
        </View>
      </View>
      <View className="bg-white w-full py-4 px-4 flex-row rounded-xl items-center justify-start my-3">
        <View className="w-16 h-16 rounded-full bg-[#50A99A1A] items-center justify-center mr-4">
          <MaterialIcons
            name="swap-horiz"
            size={40}
            color={"#50A99A"}
          />
        </View>
        <View className="flex-1 justify-between flex-row items-center">
          <View>
            <AppText weight="light" className="text-2xl text-gray-900">
              John Doe
            </AppText>
            <AppText className="text-gray-400">
              Apr 10, 2024 09:20 AM
            </AppText>
          </View>
          <View className="items-end">
            <FigureText weight="bold" className="text-2xl text-gray-900">
              $ 150
            </FigureText>
            <FigureText className="text-gray-400">100 USD</FigureText>
          </View>
        </View>
      </View>
      <View className="bg-white w-full py-4 px-4 flex-row rounded-xl items-center justify-start my-3">
        <View className="w-16 h-16 rounded-full bg-[#D1F5611A] items-center justify-center mr-4">
          <MaterialIcons
            name="mobile-friendly"
            size={40}
            color={"#D1F561"}
          />
        </View>
        <View className="flex-1 justify-between flex-row items-center">
          <View>
            <AppText weight="light" className="text-2xl text-gray-900">
              John Doe
            </AppText>
            <AppText className="text-gray-400">
              Apr 10, 2024 09:20 AM
            </AppText>
          </View>
          <View className="items-end">
            <FigureText weight="bold" className="text-2xl text-gray-900">
              $ 150
            </FigureText>
            <FigureText className="text-gray-400">100 USD</FigureText>
          </View>
        </View>
      </View> */
      }
    </View>
  );
};

export default Transactions;
