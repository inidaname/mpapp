//
//  BLEAdvertiser.swift
//  Insfers
//
//  Created by Hassan Sani on 11/12/2025.
//

// ios/YourProject/BLEAdvertiser.swift

import Foundation
import CoreBluetooth
import React

@objc(BLEAdvertiser)
class BLEAdvertiser: RCTEventEmitter, CBPeripheralManagerDelegate { // <--- Must inherit RCTEventEmitter
    
    var peripheralManager: CBPeripheralManager!
    
    // UUIDs must match your Android/JS constants
    var activeServiceUUID: CBUUID?
    var activeWriteCharUUID: CBUUID?
    
    var targetUUID: CBUUID?
    var localName: String?
    var amountData: Data?
    
    override init() {
        super.init() // <--- Now valid because we inherit from RCTEventEmitter
        peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
    }
    
    // REQUIRED: Tell React Native which events we send
    override func supportedEvents() -> [String]! {
        return ["onPaymentResponse"]
    }
    
    @objc func startBroadcast(_ username: String, amount: Double, serviceUUID: String, charUUID: String) {
        localName = username
        amountData = String(amount).data(using: .utf8)
      
        activeServiceUUID = CBUUID(string: serviceUUID)
        activeWriteCharUUID = CBUUID(string: charUUID)
        
        // If Bluetooth is already on, setup immediately
        if peripheralManager.state == .poweredOn {
            setupServiceAndAdvertise()
        }
    }
    
    func setupServiceAndAdvertise() {
      guard let sUUID = activeServiceUUID, let cUUID = activeWriteCharUUID else { return }
        // 1. Configure the GATT Service (The "Offline Server")
        let writeChar = CBMutableCharacteristic(
            type: cUUID,
            properties: [.write], // Allow writing
            value: nil,
            permissions: [.writeable] // Allow writing
        )
        
        let service = CBMutableService(type: sUUID, primary: true)
        service.characteristics = [writeChar]
        
        peripheralManager.removeAllServices()
        peripheralManager.add(service)
        
        // 2. Start Advertising
        if peripheralManager.isAdvertising { peripheralManager.stopAdvertising() }
        
        let advertisementData: [String: Any] = [
            CBAdvertisementDataServiceUUIDsKey: [sUUID],
            CBAdvertisementDataLocalNameKey: localName ?? "User",
            // iOS might ignore this key in background, but useful if active
            CBAdvertisementDataServiceDataKey: [sUUID: amountData ?? Data()]
        ]
        
        peripheralManager.startAdvertising(advertisementData)
    }
    
    @objc func stopBroadcast() {
        peripheralManager.stopAdvertising()
        peripheralManager.removeAllServices()
    }
    
    // --- CBPeripheralManagerDelegate Methods ---
    
    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        if peripheral.state == .poweredOn && localName != nil {
            setupServiceAndAdvertise()
        }
    }
    
    // Handle incoming writes (The "Offline Payment" trigger)
    func peripheralManager(_ peripheral: CBPeripheralManager, didReceiveWrite requests: [CBATTRequest]) {
        for request in requests {
            if request.characteristic.uuid == activeWriteCharUUID{
                if let value = request.value, let message = String(data: value, encoding: .utf8) {
                    // Send Event to React Native
                    sendEvent(withName: "onPaymentResponse", body: [
                        "message": message,
                        "senderId": "iOS Device"
                    ])
                }
                // Respond with Success (Handshake)
                peripheralManager.respond(to: request, withResult: .success)
            }
        }
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
