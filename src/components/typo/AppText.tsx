import React from "react";
import { Text as RNText, TextProps } from "react-native";
import { twMerge } from "tailwind-merge";

const weightMap = {
  regular: "",
  light: "light",
  thin: "thin",
  medium: "medium",
  semibold: "semibold",
  bold: "bold",
  black: "black",
  extralight: "extralight",
};

export type AppTextProps = TextProps & {
  weight?: keyof typeof weightMap;
  className?: string;
  fontFamily?: string;
};

export const FigureText: React.FC<AppTextProps> = (
  { weight = "regular", className, children, ...props },
) => {
  const weightFont = weight && weight !== "regular"
    ? weightMap[weight]
    : weightMap.regular;

  return (
    <RNText
      className={`${
        twMerge("text-black", className)
      } font-montserrat-${weightFont}`}
      {...props}
    >
      {children}
    </RNText>
  );
};

export const PoppinText: React.FC<AppTextProps> = (
  { weight = "regular", className, children, ...props },
) => {
  const weightFont = weightMap[weight] || weightMap.regular;

  return (
    <RNText
      className={`${
        twMerge("text-black", className)
      } font-poppings-${weightFont}`}
      {...props}
    >
      {children}
    </RNText>
  );
};

const AppText: React.FC<AppTextProps> = ({
  weight = "regular",
  className,
  fontFamily = "raleway",
  children,
  ...props
}) => {
  const weightFont = weight && weight !== "regular"
    ? weightMap[weight]
    : weightMap.regular;
  return (
    <RNText
      className={`${
        twMerge("text-black", className)
      } font-${fontFamily}-${weightFont}`}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default AppText;
