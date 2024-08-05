import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { GlobalContext } from "../../context/gloabalProvider";

const Home = () => {
  const { user } = useContext(GlobalContext);
  const { data: posts, reFetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    // recall  videos so if any new video updated
    await reFetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-5 space-y-6">
            {/* Header of Home page */}
            <View className="flex-row justify-between items-start mb-6">
              {/* Welcome message */}
              <View>
                <Text className="text-sm text-gray-100 font-pmedium">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>
              {/* Icon */}
              <View className="mt-2">
                <Image
                  source={images.logoSmall}
                  resizeMode="contain"
                  className="w-9 h-10"
                />
              </View>
            </View>

            {/* Search Input box */}
            <SearchInput placeholder="Search for a video topic" />

            {/* Trending Videos section */}
            <View className="w-full flex-1 pt-5 pb-8 ">
              <Text className="text-gray-100 text-xl mb-3 font-pregular">
                Trending Videos
              </Text>

              {/* if posts doesn't exist make it an empty array just so it doesn't break */}
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
