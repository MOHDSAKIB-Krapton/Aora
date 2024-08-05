import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useContext, useState } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import Modal from "react-native-modal";
import { updateBookmark } from "../lib/appwrite";
import { GlobalContext } from "../context/gloabalProvider";

const VideoCard = ({
  video: {
    $id,
    title,
    thumbnail,
    prompt,
    video,
    creator: { username, avatar },
  },
}) => {
  const [play, setPlay] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useContext(GlobalContext);

  async function handleBookmark() {
    try {
      await updateBookmark(user);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setModalVisible(false);
    }
  }

  function handleDelete() {
    console.log("Delete option selected");
    console.log($id);
    setModalVisible(false);
  }

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary-100 justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-md"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-gray-100 text-xs font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <View className="pt-2 relative">
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <Image
              source={icons.menu}
              resizeMode="contain"
              className="w-5 h-5"
            />
          </TouchableOpacity>
        </View>
      </View>

      {play ? (
        <View className="w-full h-[80vh] rounded-xl mt-3 relative justify-center items-center">
          <Video
            source={{ uri: video }}
            className="w-full h-full my-5 rounded-xl bg-white/10"
            resizeMode={ResizeMode.COVER}
            useNativeControls
            shouldPlay
            onError={() => {
              setPlay(false);
              return Alert.alert(
                "Sorry For Inconvenience: ",
                "Video couldn't play, Please try again later!"
              );
            }}
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setPlay(false); // Reset play state when video finishes
              }
            }}
          />
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setPlay(true)}
          className="w-full h-96 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="h-12 w-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        className="justify-end m-0"
      >
        <View className="bg-primary p-5 rounded-t-3xl">
          <TouchableOpacity
            className="p-3  border-b-2 border-secondary-100 w-full"
            onPress={handleDelete}
          >
            <Text className="font-psemibold text-gray-100 text-lg text-center">
              Delete
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-3 pt-5 w-full "
            onPress={handleBookmark}
          >
            <Text className="font-psemibold text-gray-100 text-lg text-center">
              Bookmark
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default VideoCard;
