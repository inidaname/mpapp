import Foundation
import CoreBluetooth

@objc(BLEAdvertiser)
class BLEAdvertiser: NSObject, CBPeripheralManagerDelegate {
    
    var peripheralManager: CBPeripheralManager?
    var targetUUID: CBUUID?
    
    override init() {
        super.init()
        // Initialize the manager immediately on the main queue
        peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
    }
    
    @objc func startBroadcast(_ uuidString: String) {
        // Convert string to CBUUID
        targetUUID = CBUUID(string: uuidString)
        
        // Try to advertise immediately
        startAdvertisingIfReady()
    }
    
    @objc func stopBroadcast() {
        peripheralManager?.stopAdvertising()
        targetUUID = nil
    }
    
    private func startAdvertisingIfReady() {
        guard let manager = peripheralManager, 
              let uuid = targetUUID, 
              manager.state == .poweredOn else {
            return
        }
        
        if manager.isAdvertising {
            manager.stopAdvertising()
        }
        
        let advertisementData: [String: Any] = [
            CBAdvertisementDataServiceUUIDsKey: [uuid],
            CBAdvertisementDataLocalNameKey: "PayDevice" // Optional: Visible Name
        ]
        
        manager.startAdvertising(advertisementData)
        print("BLEAdvertiser: Started advertising UUID \(uuid.uuidString)")
    }
    
    // MARK: - CBPeripheralManagerDelegate
    
    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        switch peripheral.state {
        case .poweredOn:
            print("BLEAdvertiser: Bluetooth is ON")
            startAdvertisingIfReady()
        case .poweredOff:
            print("BLEAdvertiser: Bluetooth is OFF")
            stopBroadcast()
        case .unauthorized:
            print("BLEAdvertiser: Permission denied")
        case .unsupported:
            print("BLEAdvertiser: BLE unsupported")
        default:
            break
        }
    }
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
}