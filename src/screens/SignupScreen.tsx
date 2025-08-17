import React from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import { Image, Text, Pressable, View } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

import FormInput from '../components/FormInput';
import { useForm } from 'react-hook-form';
import ButtonComponent from '../components/Button';
import { ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import { Button } from '@react-navigation/elements';

interface Props extends NativeStackScreenProps<RootStackParamList> { }

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { control } = useForm({
    defaultValues: { password: '' },
  });

  const handlePress = () => console.log('Pressed the');
  return (
    <ScrollView contentContainerClassName="min-h-full justify-start items-start bg-white flex-col">
      <View className="mt-20 w-full items-center">
        <Image
          source={require('../../assets/logo.png')}
          width={500}
          resizeMode="center"
        />
      </View>
      <View className="items-center w-full mt-8">
        <Text className="text-4xl font-raleway-medium">Create A Wallet</Text>
        <Text className="font-raleway px-4 text-lg mt-4 text-center">
          Add your account basic details to create your account at Insfers
        </Text>
      </View>
      <View className="h-[40px]" />
      <View className="w-full px-5">
        <FormInput
          name="username"
          label="Username"
          placeholder="Enter Username"
          leftIcon={
            <FontAwesome6
              iconStyle="solid"
              name="user"
              size={20}
              color="gray"
            />
          }
          control={control}
          keyboardType="ascii-capable"
          rules={{ required: 'Username is required' }}
        />
        <FormInput
          name="email"
          label="Email Address"
          placeholder="Enter Email Address"
          leftIcon={
            <FontAwesome6
              iconStyle="solid"
              name="envelope"
              size={20}
              color="gray"
            />
          }
          control={control}
          keyboardType="email-address"
          rules={{ required: 'Email is required' }}
        />
        <FormInput
          name="password"
          label="Password"
          placeholder="Enter Password"
          leftIcon={
            <FontAwesome6
              iconStyle="solid"
              name="lock"
              size={20}
              color="gray"
            />
          }
          isPassword={true}
          control={control}
          keyboardType="visible-password"
          rules={{ required: 'Password is required' }}
        />
        <FormInput
          name="confirmpassword"
          label="Confirm Password"
          placeholder="Confirm Password"
          leftIcon={
            <FontAwesome6
              iconStyle="solid"
              name="lock"
              size={20}
              color="gray"
            />
          }
          isPassword={true}
          control={control}
          keyboardType="visible-password"
          rules={{ required: 'Password is required' }}
        />
        <ButtonComponent label="Continue" onPress={handlePress} />
      </View>
      <View className="flex-row w-full items-center justify-center px-6 py-2">
        {/* Left gradient line */}
        <LinearGradient
          colors={[ 'transparent', '#437DFF', 'transparent' ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-1 h-5"
        />

        {/* Or text */}
        <Text className="mx-4 text-gray-600 text-base font-medium">Or</Text>

        {/* Right gradient line */}
        <LinearGradient
          colors={[ 'transparent', '#437DFF', 'transparent' ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-1 h-5"
        />
      </View>
      <View className="flex-row justify-center items-center w-full">
        <View className="border border-gray-300 border-2 h-28 w-28 rounded-full mx-4 p-4 items-center justify-center">
          <Image
            source={require('../../assets/apple.png')}
            resizeMethod="scale"
            resizeMode="cover"
            className="w-20 h-20"
          />
        </View>
        <View className="border border-gray-300 border-2 h-28 w-28 rounded-full mx-4 p-4 items-center justify-center">
          <Image
            source={require('../../assets/google.png')}
            resizeMethod="scale"
            resizeMode="cover"
            className="w-16 h-16"
          />
        </View>
      </View>
      <View className='flex flex-row justify-center items-center w-full mb-2 mt-4 h-24'>
        <Text className='font-raleway text-lg'>
          Already have an account?
        </Text>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text className='font-raleway text-lg text-brand-600'> Login</Text>
        </Pressable>
      </View>
    </ScrollView >
  );
};

export default LoginScreen;
