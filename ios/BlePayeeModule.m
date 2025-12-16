//
//  BlePayeeModule.m
//  Insfers
//
//  Created by Hassan Sani on 15/12/2025.
//
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(BlePayeeModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startServer:(NSString *)name)
RCT_EXTERN_METHOD(setConfirmationResponse:(NSString *)responseJson)

@end
