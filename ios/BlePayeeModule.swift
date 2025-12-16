import Foundation
import CoreBluetooth

@objc(BlePayeeModule)
class BlePayeeModule: RCTEventEmitter, CBPeripheralManagerDelegate {
    
    var peripheralManager: CBPeripheralManager!
    var intentChar: CBMutableCharacteristic!
    var confirmChar: CBMutableCharacteristic!
    var currentResponseData: Data?
    
    let SERVICE_UUID = CBUUID(string: "00000001-1000-8000-0080-5f9b34fb34fb")
    let INTENT_UUID = CBUUID(string: "00000002-1000-8000-0080-5f9b34fb34fb")
    let CONFIRM_UUID = CBUUID(string: "00000003-1000-8000-0080-5f9b34fb34fb")

    override func supportedEvents() -> [String]! {
        return ["onPaymentIntent"]
    }

    @objc func startServer() {
        peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
    }
    
    @objc func setConfirmationResponse(_ responseJson: String) {
        currentResponseData = responseJson.data(using: .utf8)
        
        // Notify subscribers
        if let char = confirmChar {
            peripheralManager.updateValue(currentResponseData ?? Data(), for: char, onSubscribedCentrals: nil)
        }
    }

    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        if peripheral.state == .poweredOn {
            intentChar = CBMutableCharacteristic(type: INTENT_UUID, properties: [.write], value: nil, permissions: [.writeable])
            confirmChar = CBMutableCharacteristic(type: CONFIRM_UUID, properties: [.read, .notify], value: nil, permissions: [.readable])
            
            let service = CBMutableService(type: SERVICE_UUID, primary: true)
            service.characteristics = [intentChar, confirmChar]
            
            peripheralManager.add(service)
            peripheralManager.startAdvertising([CBAdvertisementDataServiceUUIDsKey: [SERVICE_UUID]])
        }
    }
    
    // Handle Incoming Write (Intent)
    func peripheralManager(_ peripheral: CBPeripheralManager, didReceiveWrite requests: [CBATTRequest]) {
        for request in requests {
            if request.characteristic.uuid == INTENT_UUID {
                if let value = request.value, let str = String(data: value, encoding: .utf8) {
                    sendEvent(withName: "onPaymentIntent", body: str)
                }
                peripheral.respond(to: request, withResult: .success)
            }
        }
    }
    
    // Handle Incoming Read (Confirmation)
    func peripheralManager(_ peripheral: CBPeripheralManager, didReceiveRead request: [CBATTRequest]) {
        if request.characteristic.uuid == CONFIRM_UUID {
            request.value = currentResponseData
            peripheral.respond(to: request, withResult: .success)
        }
    }
}