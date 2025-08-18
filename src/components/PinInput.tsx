import React, { useRef } from 'react';
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';

interface PinInputProps {
  value: string;
  onChange: (val: string) => void;
}

const PinInput: React.FC<PinInputProps> = ({ value, onChange }) => {
  const inputsRef = useRef<Array<TextInput | null>>([]);

  // Always convert to array of length 4
  const valueArr = value.padEnd(4, ' ').split('').slice(0, 4);

  const handleChangeText = (text: string, index: number) => {
    // Paste logic
    if (text.length > 1) {
      const chars = text.slice(0, 4).split('');
      chars.forEach((c, idx) => {
        if (index + idx < 4) {
          valueArr[ index + idx ] = c;
        }
      });
      onChange(valueArr.join('').trim());
      // Optional: auto focus next after paste
      const nextIndex = Math.min(index + chars.length, 3);
      inputsRef.current[ nextIndex ]?.focus();
      return;
    }

    // Normal single char
    valueArr[ index ] = text;
    onChange(valueArr.join('').trim());

    if (text && index < 3) {
      inputsRef.current[ index + 1 ]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (valueArr[ index ] === '' && index > 0) {
        valueArr[ index - 1 ] = '';
        onChange(valueArr.join('').trim());
        inputsRef.current[ index - 1 ]?.focus();
      }
    }
  };

  8656

  return (
    <View className="flex-row justify-between">
      {valueArr.map((digit, i) => (
        <TextInput
          key={i}
          ref={(ref) => {
            inputsRef.current[ i ] = ref;
          }}
          value={digit.trim()}
          onChangeText={(text) => handleChangeText(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          maxLength={1}
          keyboardType="number-pad"
          className="border border-gray-300 rounded-xl w-16 h-16 mx-3 text-center text-xl"
        />
      ))}
    </View>
  );
};

export default PinInput;
