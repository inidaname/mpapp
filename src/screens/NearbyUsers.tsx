import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Buffer } from "buffer";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import AppText from "../components/typo/AppText";
import HeaderSide from "../components/Main/HeaderSide";
import { PAYMENT_CONFIRM_CHAR_UUID, PAYMENT_INTENT_CHAR_UUID, SERVICE_UUID } from "../data/constant";
import { bleManager } from "../utils/ble-service";
import { addOfflineTransaction } from '../store/reducers/offline-transactions';
import { useAppDispatch, useAppSelector } from '../store/redux';
import { debit } from '../store/reducers/fake-slice';

type NearbyUser = {
  deviceId: string;
  name: string;
  amount?: string;
  receiverName?: string;
  isConnected: boolean;
  loading: boolean;
  address?: string
};

const NearbyUsersScreen: React.FC = () => {
  const [ nearby, setNearby ] = useState<NearbyUser[]>([]);
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const lastSeenMap = useRef<Map<string, number>>(new Map()).current;
  const { fakeBalance } = useAppSelector(state => state.fakeSlice)
  const dispatch = useAppDispatch()

  // Animation Loop
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim1, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim1, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ).start();
  }, [ pulseAnim1 ]);

  // Scan Logic
  useEffect(() => {

    // const hasPermission = await requestPermissions();
    // if (!hasPermission) {
    //   Alert.alert("Permission Error", "Bluetooth permissions are required.");
    //   return;
    // }

    console.log("Starting Scan...");
    setNearby([]);

    bleManager.startDeviceScan(
      [ SERVICE_UUID ],
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          console.error("Scan error:", error);
          return;
        }

        if (device) {

          const now = Date.now();
          lastSeenMap.set(device.id, now);

          setNearby((prev) => {
            const exists = prev.find((u) => u.deviceId === device.id);
            if (exists) return prev;

            return [
              ...prev,
              {
                deviceId: device.id,
                name: device.name || "Insfers Device",
                isConnected: false,
                loading: false,
                amount: undefined
              },
            ];
          });
        }
      },
    );

    // const intervalId = setInterval(() => {
    //   const now = Date.now();
    //   setNearby((prev) => {
    //     // Filter out devices not seen in the last 5000ms (5 seconds)
    //     return prev.filter((user) => {
    //       const lastSeen = lastSeenMap.get(user.deviceId) || 0;
    //       const isStale = now - lastSeen > 5000;

    //       // Keep them if they are currently CONNECTED (even if not advertising)
    //       if (user.isConnected) return true;

    //       if (isStale) {
    //         console.log(`Removing stale device: ${user.name}`);
    //         lastSeenMap.delete(user.deviceId);
    //       }
    //       return !isStale;
    //     });
    //   });
    // }, 2000);


    return () => {
      console.log("Stopping Scan");
      bleManager.stopDeviceScan();
      // clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handlePaymentSuccess = (merchantName: string, amountPaid: number) => {
    const amount = Number(amountPaid)
    if (isNaN(amount)) return;

    const newTx: OfflineTransactions = {
      reference: `REF-${Date.now()}`,
      amount,
      createdAt: new Date().toISOString(),
      type: "debit", // Payer is sending money (Debit)
      status: "completed",
      synced: false,
      name: merchantName || "Unknown Merchant",
      address: null, // Fill if you have merchant wallet address
      signature: "tx_signature_placeholder",
      syncedAt: null
    };

    dispatch(addOfflineTransaction(newTx));
    dispatch(debit(amount))
    Alert.alert("Success", `Paid $${amountPaid} to ${merchantName}`);
    // setIsScanning(false);
  };

  const handleConnectAndRead = async (index: number) => {
    const user = nearby[ index ];

    const updateState = (updates: Partial<NearbyUser>) => {
      setNearby(prev => {
        const newArr = [ ...prev ];
        newArr[ index ] = { ...newArr[ index ], ...updates };
        return newArr;
      });
    };

    updateState({ loading: true });

    try {
      console.log(`Connecting to ${user.deviceId}...`);

      const device = await bleManager.connectToDevice(user.deviceId, {
        autoConnect: false,
        requestMTU: 512
      });

      await device.discoverAllServicesAndCharacteristics();

      const characteristic = await device.readCharacteristicForService(
        SERVICE_UUID.toLowerCase(),
        PAYMENT_CONFIRM_CHAR_UUID.toLowerCase()
      );

      if (characteristic.value) {
        const jsonString = Buffer.from(characteristic.value, 'base64').toString('utf8');
        console.log("Read Bill:", jsonString);

        let billData;
        try {
          billData = JSON.parse(jsonString);
        } catch (e) {
          // Fallback for non-JSON strings
          billData = { amount: "0", receiverName: "Unknown" };
        }

        console.log('billData', billData)

        updateState({
          isConnected: true,
          loading: false,
          amount: billData.amount?.toString(),
          receiverName: billData.receiverName,
          address: billData.address
        });

      }
    } catch (error) {
      console.error("Connection failed", error);
      Alert.alert("Connection Failed", "Could not read payment details.");
      setNearby(prev => prev.filter(u => u.deviceId !== user.deviceId));
    }
  };


  // Step 2: Write Confirmation
  const handlePay = async (index: number) => {
    const user = nearby[ index ];

    if (fakeBalance > 0 && fakeBalance < Number(user.amount)) {
      Alert.alert("Error", "You have insufficient balance")
      return
    }

    try {
      console.log("Sending Payment...");

      const receipt = JSON.stringify({
        amount: user.amount,
        status: "PAID",
        txId: "0x123456789",
        sender: "User_A",
        nonce: Math.random().toString()
      });

      const payload = Buffer.from(receipt).toString("base64");

      // --- FIXED LINE BELOW ---
      // Using 'writeCharacteristicWithResponseForDevice' because we are calling it on 'bleManager'
      await bleManager.writeCharacteristicWithResponseForDevice(
        user.deviceId,
        SERVICE_UUID.toLowerCase(),
        PAYMENT_INTENT_CHAR_UUID.toLowerCase(),
        payload
      );


      // 3. LISTEN FOR RECEIPT (Important!)
      // We need to know if the merchant approved it.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const device = await bleManager.devices([ user.deviceId ]); // Get device instance
      // Note: In ble-plx you usually keep the device object reference.
      // Assuming you can get the device object or use bleManager.monitorCharacteristicForDevice

      // console.log("Waiting for confirmation...");

      // const subscription = bleManager.monitorCharacteristicForDevice(
      //   user.deviceId,
      //   SERVICE_UUID.toLowerCase(),
      //   PAYMENT_CONFIRM_CHAR_UUID.toLowerCase(),
      //   (error, char) => {
      //     if (char?.value) {
      //       const response = JSON.parse(Buffer.from(char.value, 'base64').toString('utf8'));

      //       if (response.status === "APPROVED") {
      //         Alert.alert("Success", "Payment Approved by Merchant!");
      //         subscription.remove(); // Stop listening
      //         bleManager.cancelDeviceConnection(user.deviceId); // Disconnect

      //         // Remove from list
      //         setNearby(prev => prev.filter(u => u.deviceId !== user.deviceId));
      //       }
      //     }
      //   }
      // );

      handlePaymentSuccess(user.receiverName || user.name, Number(user.amount))

      Alert.alert("Success", `Paid $${user.amount} to ${user.receiverName || user.name}`);

      // Disconnect
      try {
        await bleManager.cancelDeviceConnection(user.deviceId);
      } catch (e) {
        console.log("Already disconnected");
      }

      setNearby(prev => prev.filter(u => u.deviceId !== user.deviceId));

    } catch (error) {
      console.error("Payment failed", error);
      Alert.alert("Error", "Payment transmission failed.");
    }
  };


  return (
    <View className="flex-1 bg-white items-center justify-between">
      <HeaderSide heading="Search Nearby Users" isWithBack />

      <View className="items-center justify-center mt-10">
        <Ring anim={pulseAnim1} color="bg-blue-500" />
        <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center">
          <MaterialIcons name="sensors" size={40} color="white" />
        </View>
      </View>

      <View className="bottom-8 w-11/12 bg-gray-100 p-4 rounded-xl h-1/2">
        <AppText className="font-bold text-base mb-2">
          Found Receivers ({nearby.length})
        </AppText>

        {nearby.map((u, index) => (
          <View
            key={u.deviceId}
            className="flex-row items-center justify-between bg-white p-4 rounded-lg shadow mb-2"
          >
            <View className='flex-1 mr-2'>
              {u.isConnected && u.amount ? (
                <>
                  <AppText className="font-bold text-lg text-green-600">
                    ${u.amount}
                  </AppText>
                  <AppText numberOfLines={1} className="w-full text-xs text-gray-500">
                    Pay to: <AppText ellipsizeMode='middle' className='truncate font-bold text-xs text-gray-500'>{u.address || u.name}</AppText>
                  </AppText>
                </>
              ) : (
                <AppText className="font-medium text-sm text-gray-800">
                  {u.name || u.deviceId}
                </AppText>
              )}
            </View>

            <View className='flex-row items-center justify-center gap-x-5'>
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${u.isConnected ? "bg-green-500" : "bg-blue-500"}`}
                onPress={() => {
                  if (u.isConnected) {
                    handlePay(index);
                  } else {
                    handleConnectAndRead(index);
                  }
                }}
                disabled={u.loading}
              >
                {u.loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <MaterialIcons color={"white"} size={20} name={u.isConnected ? `check` : `connect-without-contact`} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg bg-red-500`}
                onPress={() => {
                  console.log("Cancel")
                }}
                disabled={u.loading}
              >
                {u.loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <MaterialIcons name='close' color={"white"} size={20} />
                )}
              </TouchableOpacity>

            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default NearbyUsersScreen

function Ring({ anim, color }: { anim: Animated.Value; color: string }) {
  const scale = anim.interpolate({
    inputRange: [ 0, 1 ],
    outputRange: [ 0.6, 2.5 ],
  });
  const opacity = anim.interpolate({
    inputRange: [ 0, 1 ],
    outputRange: [ 0.6, 0 ],
  });
  return (
    <Animated.View
      style={{ transform: [ { scale } ], opacity }}
      className={`absolute w-64 h-64 rounded-full ${color}`}
    />
  );
}