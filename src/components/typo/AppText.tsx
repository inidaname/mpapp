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
};

export const FigureText: React.FC<AppTextProps> = (
  { weight = "regular", className, children, ...props },
) => {
  const fontFamily = weightMap[weight] || weightMap.regular;

  return (
    <RNText
      className={`${className ?? ""} font-montserrat${fontFamily}`}
      {...props}
    >
      {children}
    </RNText>
  );
};

const AppText: React.FC<AppTextProps> = ({
  weight = "regular",
  className,
  children,
  ...props
}) => {
  const fontFamily = weightMap[weight] || weightMap.regular;
  return (
    <RNText
      className={`${className ?? ""} font-raleway${fontFamily}`}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default AppText;
