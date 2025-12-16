//
//  BlePayeeModule.swift
//  Insfers
//
//  Created by Hassan Sani on 15/12/2025.
//

import CoreBluetooth
import Foundation

@objc(BlePayeeModule)
class BlePayeeModule: RCTEventEmitter, CBPeripheralManagerDelegate {

    var peripheralManager: CBPeripheralManager!
    var intentChar: CBMutableCharacteristic!
    var confirmChar: CBMutableCharacteristic!
    var currentResponseData: Data?

    let SERVICE_UUID = CBUUID(string: "40c40001-8b63-4702-959c-73891460c4d8")
    let INTENT_UUID = CBUUID(string: "40c40002-8b63-4702-959c-73891460c4d8")
    let CONFIRM_UUID = CBUUID(string: "40c40003-8b63-4702-959c-73891460c4d8")
    let CLAIM_CHAR_UUID = CBUUID(string: "40c40004-8b63-4702-959c-73891460c4d8")

    override func supportedEvents() -> [String]! {
        return ["onPaymentIntent"]
    }

    @objc func startServer(_ name: String) {
        peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
        self.advertisedName = name
    }

    var advertisedName: String = "Merchant"

    @objc func setConfirmationResponse(_ responseJson: String) {
        currentResponseData = responseJson.data(using: .utf8)

        if let char = confirmChar {
            peripheralManager.updateValue(
                currentResponseData ?? Data(), for: char, onSubscribedCentrals: nil)
        }
    }

    @objc func stopServer() {
        peripheralManager.stopAdvertising()
        peripheralManager.removeAllServices()
    }

    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        if peripheral.state == .poweredOn {
            intentChar = CBMutableCharacteristic(
                type: INTENT_UUID, properties: [.write], value: nil, permissions: [.writeable])
            confirmChar = CBMutableCharacteristic(
                type: CONFIRM_UUID, properties: [.read, .notify], value: nil,
                permissions: [.readable])

            let service = CBMutableService(type: SERVICE_UUID, primary: true)
            service.characteristics = [intentChar, confirmChar]

            peripheralManager.add(service)
            peripheralManager.startAdvertising([
                CBAdvertisementDataServiceUUIDsKey: [SERVICE_UUID],
                CBAdvertisementDataLocalNameKey: self.advertisedName,
            ])
        }
    }

    func peripheralManager(
        _ peripheral: CBPeripheralManager, didReceiveWrite requests: [CBATTRequest]
    ) {
        for request in requests {
            if request.characteristic.uuid == INTENT_UUID {
                if let value = request.value, let str = String(data: value, encoding: .utf8) {
                    sendEvent(withName: "onPaymentIntent", body: str)
                }
                peripheral.respond(to: request, withResult: .success)
            }
        }
    }

    func peripheralManager(_ peripheral: CBPeripheralManager, didReceiveRead request: CBATTRequest)
    {
        guard request.characteristic.uuid == CONFIRM_UUID else {
            peripheral.respond(to: request, withResult: .requestNotSupported)
            return
        }

        request.value = currentResponseData ?? Data()
        peripheral.respond(to: request, withResult: .success)
    }

}
