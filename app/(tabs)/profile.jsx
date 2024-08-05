import {
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserPosts, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import EmptyState from "../../components/EmptyState";
import { GlobalContext } from "../../context/gloabalProvider";
import { icons } from "../../constants";
import InfoBox from "../../components/InfoBox";
import { router } from "expo-router";
import Loader from "../../components/Loader";

const profile = () => {
  const { user, setUser, setIsLoggedIn } = useContext(GlobalContext);

  const {
    data: posts,
    setIsLoading,
    isLoading,
    reFetch,
  } = useAppwrite(() => getUserPosts(user.$id));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    // recall  videos so if any new video updated
    await reFetch();
    setRefreshing(false);
  };

  function logout() {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await signOut();
            setUser(null);
            setIsLoggedIn(false);
            router.replace("/sign-in");
          },
        },
      ],
      { cancelable: true }
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => {
          return <VideoCard video={item} onLoad={() => setIsLoading(false)} />;
        }}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            {/* User Profile */}
            <View className="w-16 h-16 border border-secondary-100 rounded-lg justify-center items-center p-0.5">
              <Image
                source={{ uri: user?.avatar }}
                className="w-full h-full rounded-md"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            {/* User Info */}
            <View className="mt-5 flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-xl"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <>
            {isLoading ? (
              <Loader
                dimensions="w-10 h-10"
                otherStyles="mx-auto my-10 border-white"
              />
            ) : (
              <EmptyState
                title="No videos found"
                subtitle="You haven't created any videos yet"
              />
            )}
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default profile;
