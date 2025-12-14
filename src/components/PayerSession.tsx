import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, View } from "react-native";
import { connectAndSend, scanNearby } from "../utils/ble-manager";
import { createTransaction } from "../utils/transactionService";

export default function PayerSession() {
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    scanNearby((device) => setDevices((prev) => [...prev, device]));
  }, []);

  const pay = async (device: any) => {
    const payload = device.name; // demo: session ID in name
    const tx = await createTransaction(payload, 100);
    await connectAndSend(
      device.id,
      "serviceUUID",
      "charUUID",
      JSON.stringify(tx),
    );
    Alert.alert("Transaction sent. Waiting for receipt.");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nearby Receivers</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            <Text>{item.name || item.id}</Text>
            <Button title="Pay" onPress={() => pay(item)} />
          </View>
        )}
      />
    </View>
  );
}
