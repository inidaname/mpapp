package com.insfers

import android.bluetooth.*
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.content.Context
import android.os.ParcelUuid
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.*

class BlePayeeModule(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

        private var bluetoothManager: BluetoothManager =
                reactContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        private var gattServer: BluetoothGattServer? = null
        private var currentConfirmationData: ByteArray = ByteArray(0)

        // UUIDs must match the constants defined in JS
        val SERVICE_UUID = UUID.fromString("40c40001-8b63-4702-959c-73891460c4d8")
        val INTENT_UUID = UUID.fromString("40c40002-8b63-4702-959c-73891460c4d8")
        val CONFIRM_UUID = UUID.fromString("40c40003-8b63-4702-959c-73891460c4d8")
        val CLAIM_CHAR_UUID = UUID.fromString("40c40004-8b63-4702-959c-73891460c4d8")

        override fun getName(): String = "BlePayeeModule"

        @ReactMethod
        fun startServer(name: String) {
                val adapter = bluetoothManager.adapter
                if (!adapter.isEnabled) return // Handle properly in production

                // 1. Setup Characteristics
                val intentChar =
                        BluetoothGattCharacteristic(
                                INTENT_UUID,
                                BluetoothGattCharacteristic.PROPERTY_WRITE,
                                BluetoothGattCharacteristic.PERMISSION_WRITE
                        )
                val confirmChar =
                        BluetoothGattCharacteristic(
                                CONFIRM_UUID,
                                BluetoothGattCharacteristic.PROPERTY_READ or
                                        BluetoothGattCharacteristic.PROPERTY_NOTIFY,
                                BluetoothGattCharacteristic.PERMISSION_READ
                        )

                val service =
                        BluetoothGattService(
                                SERVICE_UUID,
                                BluetoothGattService.SERVICE_TYPE_PRIMARY
                        )
                service.addCharacteristic(intentChar)
                service.addCharacteristic(confirmChar)

                // 2. Open Server
                gattServer =
                        bluetoothManager.openGattServer(reactApplicationContext, gattServerCallback)
                gattServer?.addService(service)

                // 3. Start Advertising
                val advertiser = adapter.bluetoothLeAdvertiser
                val settings =
                        AdvertiseSettings.Builder()
                                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
                                .setConnectable(true)
                                .build()
                val data =
                        AdvertiseData.Builder()
                                .setIncludeDeviceName(true)
                                .addServiceUuid(ParcelUuid(SERVICE_UUID))
                                .build()

                advertiser.startAdvertising(
                        settings,
                        data,
                        object : AdvertiseCallback() {
                                override fun onStartSuccess(settingsInEffect: AdvertiseSettings?) {
                                        Log.d("BLE", "Advertising started")
                                }
                        }
                )
        }

        @ReactMethod
        fun setConfirmationResponse(responseJson: String) {
                currentConfirmationData = responseJson.toByteArray(Charsets.UTF_8)

                val deviceList = bluetoothManager.getConnectedDevices(BluetoothProfile.GATT)
                val service = gattServer?.getService(SERVICE_UUID)
                val char = service?.getCharacteristic(CONFIRM_UUID)
                if (char != null) {
                        char.value = currentConfirmationData
                        deviceList.forEach { device ->
                                gattServer?.notifyCharacteristicChanged(device, char, false)
                        }
                }
        }

        @ReactMethod
        fun stopServer() {
                val advertiser = bluetoothManager.adapter.bluetoothLeAdvertiser
                        advertiser?.stopAdvertising(object : AdvertiseCallback() {})

                val connectedDevices = bluetoothManager.getConnectedDevices(BluetoothProfile.GATT)
                        connectedDevices.forEach { device ->
                                gattServer?.cancelConnection(device) 
                        }

                        gattServer?.clearServices()
                        gattServer?.close() 
                        gattServer = null
        }

        private val gattServerCallback =
                object : BluetoothGattServerCallback() {
                        override fun onCharacteristicWriteRequest(
                                device: BluetoothDevice,
                                requestId: Int,
                                characteristic: BluetoothGattCharacteristic,
                                preparedWrite: Boolean,
                                responseNeeded: Boolean,
                                offset: Int,
                                value: ByteArray
                        ) {
                                if (characteristic.uuid == INTENT_UUID) {
                                        // 1. Receive Intent
                                        val intentJson = String(value, Charsets.UTF_8)

                                        // 2. Send to React Native
                                        sendEvent("onPaymentIntent", intentJson)

                                        // 3. Tell Payer "We got it"
                                        if (responseNeeded) {
                                                gattServer?.sendResponse(
                                                        device,
                                                        requestId,
                                                        BluetoothGatt.GATT_SUCCESS,
                                                        0,
                                                        null
                                                )
                                        }
                                }
                        }

                        override fun onCharacteristicReadRequest(
                                device: BluetoothDevice,
                                requestId: Int,
                                offset: Int,
                                characteristic: BluetoothGattCharacteristic
                        ) {
                                if (characteristic.uuid == CONFIRM_UUID) {
                                        // 4. Send Confirmation back
                                        gattServer?.sendResponse(
                                                device,
                                                requestId,
                                                BluetoothGatt.GATT_SUCCESS,
                                                0,
                                                currentConfirmationData
                                        )
                                }
                        }
                }

        private fun sendEvent(eventName: String, params: String) {
                reactApplicationContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit(eventName, params)
        }
}
