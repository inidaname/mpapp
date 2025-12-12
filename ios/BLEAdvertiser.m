//
//  BLEAdvertiser.m
//  Insfers
//
//  Created by Hassan Sani on 11/12/2025.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(BLEAdvertiser, RCTEventEmitter)

RCT_EXTERN_METHOD(startBroadcast:(NSString *)username
                  amount:(double)amount
                  serviceUUID:(NSString *)serviceUUID
                  charUUID:(NSString *)charUUID)
RCT_EXTERN_METHOD(stopBroadcast)

@end
