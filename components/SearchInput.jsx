import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({ placeholder, initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  function handleSearch() {
    // If user enter nothing in search field and click on search icon
    if (!query) {
      return Alert.alert("Missing Query", "Please enter a query to search");
    }

    //
    if (pathname.startsWith("/search")) {
      router.setParams({ query });
    } else {
      router.push(`search/${query}`);
    }
  }

  return (
    <View className="w-96 rounded-xl border-2 border-black-200 h-16 px-4 bg-black-100 focus:border-secondary flex-row items-center">
      <TextInput
        className="flex-1 text-white font-psemibold text-base"
        value={query}
        onChangeText={(e) => setQuery(e)}
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
      />

      <TouchableOpacity onPress={handleSearch}>
        <Image
          source={icons.search}
          className="w-5 h-5 "
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
