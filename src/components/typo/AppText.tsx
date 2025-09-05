import React from "react";
import { Text as RNText, TextProps } from "react-native";

const weightMap = {
  regular: "",
  light: "-light",
  thin: "-thin",
  medium: "-medium",
  semibold: "-semibold",
  bold: "-bold",
  black: "-black",
  extralight: "-extralight",
};

export type AppTextProps = TextProps & {
  weight?: keyof typeof weightMap;
  className?: string;
  fontFamily?: string;
};

export const FigureText: React.FC<AppTextProps> = (
  { weight = "regular", className, children, ...props },
) => {
  const fontFamily = weightMap[weight] || weightMap.regular;

  return (
    <AppText
      className={className}
      weight={fontFamily as keyof typeof weightMap}
      fontFamily="montserrat"
      {...props}
    >
      {children}
    </AppText>
  );
};

export const PoppinText: React.FC<AppTextProps> = (
  { weight = "regular", className, children, ...props },
) => {
  const fontFamily = weightMap[weight] || weightMap.regular;

  return (
    <AppText
      className={className}
      weight={fontFamily as keyof typeof weightMap}
      fontFamily="poppings"
      {...props}
    >
      {children}
    </AppText>
  );
};

const AppText: React.FC<AppTextProps> = ({
  weight = "regular",
  className,
  fontFamily = "raleway",
  children,
  ...props
}) => {
  const weightFonte = weightMap[weight] || weightMap.regular;
  return (
    <RNText
      className={`${className ?? ""} font-${fontFamily}${weightFonte}`}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default AppText;
