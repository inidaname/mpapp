import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { BTEManager, scanNearby } from "../utils/ble-manager";
import { verifyIncomingTransaction } from "../utils/transactionService";
import { Alert } from "react-native";

export default function ReceiverSession() {
  useEffect(() => {
    const subscription = BTEManager.onStateChange((state) => {
      if (state === "PoweredOn") {
        scanNearby(async (device) => {
          try {
            const payloadStr = device.name; // demo: assume session payload in name
            const tx = JSON.parse(payloadStr ?? "");
            const valid = await verifyIncomingTransaction(tx);
            if (valid) {
              Alert.alert(
                "Confirm Transaction",
                `Incoming transaction ${tx.amount} from ${tx.from}`,
              );
            }
          } catch {}
        });
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Receiver Session Active. Keep app open on iOS.</Text>
    </View>
  );
}
