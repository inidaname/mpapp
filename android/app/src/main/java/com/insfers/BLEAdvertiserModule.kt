package com.insfers

import android.bluetooth.*
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.BluetoothLeAdvertiser
import android.content.Context
import android.os.ParcelUuid
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.nio.charset.StandardCharsets
import java.util.UUID

class BLEAdvertiserModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var advertiser: BluetoothLeAdvertiser? = null
    private var gattServer: BluetoothGattServer? = null
    private var advertiseCallback: AdvertiseCallback? = null
    

    override fun getName(): String = "BLEAdvertiser"

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    @ReactMethod
    fun startBroadcast(username: String, amount: Double, serviceUUID: String, writeCharUUID: String) {
        val context = reactApplicationContext
        val manager = context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        val adapter = manager.adapter

        if (adapter == null || !adapter.isEnabled) return

        if (gattServer == null) {
            gattServer = manager.openGattServer(context, gattServerCallback)
            if (gattServer != null) {
                setupServerServices(serviceUUID, writeCharUUID)
            }
        }

        advertiser = adapter.bluetoothLeAdvertiser
        val settings = AdvertiseSettings.Builder()
            .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
            .setConnectable(true) // MUST BE TRUE FOR CONNECTION
            .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
            .build()

        val pUuid = ParcelUuid(UUID.fromString(serviceUUID))
        val amountBytes = amount.toString().toByteArray(StandardCharsets.UTF_8)

        val data = AdvertiseData.Builder()
            .setIncludeDeviceName(false)
            .addServiceUuid(pUuid)
            .addServiceData(pUuid, amountBytes) 
            .build()

        val safeName = if (username.length > 8) username.substring(0, 8) else username
        adapter.name = safeName 

        val scanResponse = AdvertiseData.Builder()
            .setIncludeDeviceName(true)
            .build()

        advertiseCallback = object : AdvertiseCallback() {
            override fun onStartSuccess(settingsInEffect: AdvertiseSettings) {
                Log.d("BLEAdvertiser", "Server & Advertising Started")
            }
            override fun onStartFailure(errorCode: Int) {
                Log.e("BLEAdvertiser", "Advertising Failed: $errorCode")
            }
        }

        advertiser?.startAdvertising(settings, data, scanResponse, advertiseCallback)
    }

    private fun setupServerServices(serviceUUID: String, writeCharUUID: String) {
        val service = BluetoothGattService(UUID.fromString(serviceUUID), BluetoothGattService.SERVICE_TYPE_PRIMARY)

        val writeChar = BluetoothGattCharacteristic(
            UUID.fromString(writeCharUUID),
            BluetoothGattCharacteristic.PROPERTY_WRITE,
            BluetoothGattCharacteristic.PERMISSION_WRITE
        )

        service.addCharacteristic(writeChar)
        gattServer?.addService(service)
    }

    private val gattServerCallback = object : BluetoothGattServerCallback() {
        override fun onConnectionStateChange(device: BluetoothDevice, status: Int, newState: Int) {
            super.onConnectionStateChange(device, status, newState)
            Log.d("BLEAdvertiser", "Connection state: $newState")
        }

        override fun onCharacteristicWriteRequest(
            device: BluetoothDevice,
            requestId: Int,
            characteristic: BluetoothGattCharacteristic,
            preparedWrite: Boolean,
            responseNeeded: Boolean,
            offset: Int,
            value: ByteArray
        ) {
            super.onCharacteristicWriteRequest(device, requestId, characteristic, preparedWrite, responseNeeded, offset, value)

            if (responseNeeded) {
                gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, 0, null)
            }

            val message = String(value, StandardCharsets.UTF_8)
            Log.d("BLEAdvertiser", "Received Message: $message")

            val params = Arguments.createMap()
            params.putString("senderId", device.address)
            params.putString("message", message) 
            sendEvent("onPaymentResponse", params)
        }
    }

    @ReactMethod
    fun stopBroadcast() {
        advertiser?.stopAdvertising(advertiseCallback)
        gattServer?.close()
        gattServer = null
        Log.d("BLEAdvertiser", "Stopped")
    }
}