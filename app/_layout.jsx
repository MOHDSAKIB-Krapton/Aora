import React from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GlobalProvider } from "../context/gloabalProvider";

// this will prevent the default hiding of screen
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  // useFont is a hook which provide the font and error if not loaded
  // in usefont provide a string of name of the font and path to that font
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  // Loading the assets like fonts
  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      // this will show the blank screen but if our font is loaded than we should be good to go
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    // Route using slot navigation
    // <>
    //   <Text>Header</Text>

    //   {/* Slot will show first child component of this component (as per file base routing) in this case only index file is present for now so it will be rendered */}
    //   <Slot />
    //   <Text>Footer</Text>
    // </>

    // Route using Stack
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="search/[query]"
          options={{
            headerTitle: "Search",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#161622",
            },
            headerTintColor: "white",
          }}
        />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
