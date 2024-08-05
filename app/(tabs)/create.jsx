import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { createVideo } from "../../lib/appwrite";
import { GlobalContext } from "../../context/gloabalProvider";
import { router } from "expo-router";

const Create = () => {
  const { user } = useContext(GlobalContext);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const [uploading, setUploading] = useState(false);

  // Picking up the video  and thumbnail
  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/.png", "image/jpg", "image/jpeg"]
          : ["video/gif", "video/mp4"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      } else if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  // Submitting the form
  async function submit() {
    if (!form.title || !form.video || (!form.thumbnail && !form.thumbnail)) {
      return Alert.alert(`All fields required`, `Please fill all the fields`);
    }

    setUploading(true);
    try {
      const newvideo = await createVideo({ ...form, userId: user.$id });

      if (newvideo) {
        Alert.alert("Sucess", "Video Uploaded successfully");
        router.replace("/home");
      }
    } catch (e) {
      Alert.alert("Video Uploading failed", e);
    } finally {
      // Clearing the form after submitting the form
      setForm({ ...form, title: "", video: null, thumbnail: null, prompt: "" });
      setUploading(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full ">
      <ScrollView className="mt-6 px-4">
        <Text className="text-2xl font-psemibold text-white">Upload Video</Text>

        {/* Video Title field*/}
        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        {/* Upload Video  Field */}
        <View className="mt-7 space-y-2">
          <Text className="text-gray-100 font-pmedium text-base ">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-60 rounded-xl"
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                isMuted
              />
            ) : (
              <View className="w-full h-40 bg-black-100 rounded-xl justify-center items-center">
                <View className=" border border-dashed border-secondary-100 w-12 h-12 justify-center items-center ">
                  <Image
                    source={icons.upload}
                    className="w-2/3 h-2/3"
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Thumbnail field */}
        <View className="mt-7 space-y-2">
          <Text className="text-gray-100 font-pmedium text-base ">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-60 rounded-xl bg-black-100 "
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-28 bg-black-100 rounded-xl justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-gray-100 font-pmedium text-sm ">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* AI prompt field */}
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The AI Prompt for your video"
          otherStyles="mt-10"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
        />

        {/* Submit Button */}
        <CustomButton
          title="Submit & Publish"
          containerStyles="my-10"
          handlePress={submit}
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
