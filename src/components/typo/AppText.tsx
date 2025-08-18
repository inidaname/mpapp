import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

const weightMap = {
  regular: 'raleway',
  light: 'raleway-light',
  thin: 'raleway-thin',
  medium: 'raleway-medium',
  semibold: 'raleway-semibold',
  bold: 'raleway-bold',
  black: 'raleway-black',
  extralight: 'raleway-extralight',
};

export type AppTextProps = TextProps & {
  weight?: keyof typeof weightMap;
  className?: string;
};

const AppText: React.FC<AppTextProps> = ({
  weight = 'regular',
  className,
  children,
  ...props
}) => {
  const fontFamily = weightMap[ weight ] || weightMap.regular;
  return (
    <RNText
      className={`${className ?? ''} font-${fontFamily}`}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default AppText;

