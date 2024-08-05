import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { useContext } from "react";
import { GlobalContext } from "../context/gloabalProvider";

export default function App() {
  const { isLoading, isLoggedIn } = useContext(GlobalContext);

  // This will redirect  user to  home  screen if the user has already created the account and just refreshed the app
  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    // safe area view keeps the top and bottom dynamic as per the device
    <SafeAreaView className="bg-primary h-full">
      {/* This scrollview will let user to scroll the content in case the content is not getting in full screen */}
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        {/* View is just a div */}
        <View className="h-full w-full px-4 justify-center items-center">
          {/* Image will lets you render the images in RN and resizemode can have values like contain cover etc */}
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />

          {/* Card Image */}
          <Image
            source={images.cards}
            className="w-full max-w-[380px] h-[300px]"
            resizeMode="contain"
          />

          {/* This will work as a div */}
          <View className="relative mt-5">
            {/* Just like the text element  */}
            <Text className="text-3xl text-white text-center font-bold">
              Discover Endless Possibilities with{" "}
              {/* Like the span element inside text */}
              <Text className="text-secondary-200">Aora</Text>
            </Text>

            {/* Underline Image */}
            <Image
              source={images.path}
              className="w-[100px] h-15px right-20 -bottom-5 absolute"
              resizeMode="contain"
            />
          </View>

          <Text className="text-gray-100 mt-7 text-sm font-pregular text-center">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Aora
          </Text>

          {/* router.push will redirect you to the page you provided the url of  */}
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      {/* This will help to  show the status bar */}
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
