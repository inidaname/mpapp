import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { bleManager } from './ble-service';

export async function scanNearby(onDeviceFound: (device: Device) => void) {
  bleManager.startDeviceScan(
    null,
    { allowDuplicates: false },
    (error, device) => {
      if (error) return console.error(error);
      console.log('device', device);
      if (device && device.name) onDeviceFound(device);
    },
  );
}

export async function stopScan() {
  bleManager.stopDeviceScan();
}

export async function connectAndSend(
  deviceId: string,
  serviceUUID: string,
  charUUID: string,
  payload: string,
) {
  try {
    const device = await bleManager.connectToDevice(deviceId);
    await device.discoverAllServicesAndCharacteristics();
    const base64Data = Buffer.from(payload).toString('base64');
    await device.writeCharacteristicWithResponseForService(
      serviceUUID,
      charUUID,
      base64Data,
    );
  } catch (err) {
    console.error('BLE send error:', err);
  }
}
