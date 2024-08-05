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

const Bookmark = () => {
  const { user } = useContext(GlobalContext);
  const { data: posts, reFetch } = useAppwrite(getAllPosts);
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
          <View className="mt-6 mb-10 px-5 space-y-6">
            {/* Header of Home page */}
            <View className="flex-row justify-between items-start mb-6">
              {/* Welcome message */}

              <Text className="text-2xl font-psemibold text-white">
                Saved Videos
              </Text>
            </View>

            {/* Search Input box */}
            <SearchInput placeholder="Search your saved videos.." />
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

export default Bookmark;
