
import React, { useRef, useState } from 'react';

import { View, Text, Image, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { onboardingSlides } from '../data/onboarding';
import { RootStackParamList } from '../types/types';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

interface Props extends NativeStackScreenProps<RootStackParamList> { }

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const pagerRef = useRef<{
    setPage: React.Dispatch<React.SetStateAction<number>>;
  } | null>(null);
  const [ page, setPage ] = useState(0);
  console.log('navigation', navigation);

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    navigation.replace('Home');
  };

  return (
    <View className="flex-1 mx-0 px-0 bg-white">
      <PagerView
        style={{ flex: 1 }}
        className="px-0 mx-0"
        initialPage={0}
        ref={pagerRef as any}
        onPageSelected={e => setPage(e.nativeEvent.position)}
      >
        {onboardingSlides.map(slide => (
          <View
            key={slide.id}
            className={`"flex-1 items-center px-0 mx-0 justify-end pt-6 bg-white relative" ${Array.isArray(slide.image) && " bg-[#215CE11A]"}`}
          >
            {Array.isArray(slide.image) ? (
              slide.image.map((image, index) => (
                <Image
                  key={image}
                  source={image}
                  className={`mb-8 absolute w-full ${index === 0 ? "top-24" : "top-20"}`}
                  resizeMode={index === 0 ? "contain" : "stretch"}
                  width={500}
                />
              ))
            ) : (
              <Image
                source={slide.image}
                className={`mb-8 absolute w-full ${slide.id === 2 ? "top-10" : "top-24"}`}
                resizeMode={slide.id === 2 ? "cover" : "contain"}
                width={500}
              />
            )}
            <LinearGradient
              className="w-full m-0"
              colors={[ 'rgba(255, 255, 255, 0)', '#FFFFFF' ]}
              locations={[ 0, 0.4018 ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View className="w-full px-8 h-[277px] justify-end items-center">
                {slide.id !== onboardingSlides.length ?
                  <Text className="text-4xl font-raleway-bold text-center">
                    {slide.title}
                    <Text className="text-4xl font-raleway-bold text-center text-[#215CE1]">
                      {slide.blueTitle}
                    </Text>
                  </Text> : <Text className="text-4xl font-raleway-bold text-center">
                    <Text className='text-[#215CE1]'>{slide.blueTitle}</Text>
                    <Text className="text-4xl font-raleway-bold text-center">
                      {slide.title}
                    </Text>
                  </Text>
                }
                <Text className="text-lg text-gray-500 text-center">
                  {slide.description}
                </Text>
              </View>
            </LinearGradient>
          </View>
        ))}
      </PagerView>

      {/* <View className="flex-row justify-center mb-4">
        {onboardingSlides.map((_, i) => (
          <View
            key={i}
            className={`h-2 w-2 rounded-full mx-1 ${page === i ? "bg-blue-500" : "bg-gray-300"}`}
          />
        ))}
      </View> */}

      <View className="flex-row justify-center items-end px-6 pb-20 h-[200px] bg-white m-0">
        {page < onboardingSlides.length - 1 ? (
          <>
            {/* <TouchableOpacity onPress={finishOnboarding}>
              <Text className="text-gray-500">Skip</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              className="w-24 h-24 bg-[#215CE1] rounded-3xl justify-center items-center"
              onPress={() => pagerRef.current?.setPage(page + 1)}
            >
              <FontAwesome6
                name="arrow-right"
                iconStyle="solid"
                color="#fff"
                size={30}
              />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            className="w-24 h-24 bg-[#215CE1] rounded-3xl justify-center items-center"
            onPress={finishOnboarding}
          >
            <FontAwesome6
              name="arrow-right"
              iconStyle="solid"
              color="#fff"
              size={30}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OnboardingScreen;