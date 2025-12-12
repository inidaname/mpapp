//
//  RCT.h
//  Insfers
//
//  Created by Hassan Sani on 11/12/2025.
//


#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BLEAdvertiser, NSObject)

RCT_EXTERN_METHOD(startBroadcast:(NSString *)uuidString)
RCT_EXTERN_METHOD(stopBroadcast)

@end