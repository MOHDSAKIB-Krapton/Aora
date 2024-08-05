import React from "react";
import { View as AnimatableView } from "react-native-animatable";

const Loader = ({ dimensions, otherStyles }) => {
  return (
    <AnimatableView
      animation="rotate"
      iterationCount="infinite"
      className={` border-t-2 border-r-2 border-primary rounded-full ${dimensions} ${otherStyles} `}
    />
  );
};

export default Loader;
