import { View, Text, FlatList, Image, Alert } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import { searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useLocalSearchParams } from "expo-router";
import EmptyState from "../../components/EmptyState";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, reFetch } = useAppwrite(() => searchPosts(query));

  // To fetch search posts again once user enter more query
  useEffect(() => {
    reFetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="mb-6 px-5">
            {/* Search result header */}
            <Text className="text-sm text-gray-100 font-pmedium">
              Search results for
            </Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>

            <View className="mt-6 mb-8">
              {/* Search Input box */}
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="No Videos found for this search query. Please try something else"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
