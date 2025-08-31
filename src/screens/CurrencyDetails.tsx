import type React from 'react'

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';


interface Props extends NativeStackScreenProps<RootStackParamList> {
  currency: s
}


const CurrencyDetail: React.FC<Props> = ({ navigation }) => { }