import { Text, TouchableOpacity } from "react-native";
import React from "react";
import Loader from "./Loader";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {!isLoading ? (
        <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
          {title}
        </Text>
      ) : (
        <Loader dimensions="w-5 h-5" />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
