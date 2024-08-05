import {
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import React, { useState } from "react";
import { icons } from "../constants";
import { Video, ResizeMode } from "expo-av";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};
const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        (
          <Video
            source={{ uri: item.video }}
            // source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
            className="w-52 h-72 my-5 rounded-xl shadow-lg shadow-black-100 bg-white/10"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onError={() => {
              setPlay(false);
              return Alert.alert(
                "Sorry For Incovenience: ",
                "Video couldn't play, Please try again later!"
              );
            }}
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setPlay(false); // Reset play state when video finishes
              }
            }}
            // isLooping={true}
          />
        ) || <Text className="text-2xl text-white">hey</Text>
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.5}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 my-5 overflow-hidden rounded-xl shadow-lg shadow-black-100"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            resizeMode="contain"
            className="w-12 h-12 absolute"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 145 }}
      horizontal
    />
  );
};

export default Trending;
