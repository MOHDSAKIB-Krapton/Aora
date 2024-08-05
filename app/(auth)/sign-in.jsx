import { Text, View, ScrollView, Image, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { GlobalContext } from "../../context/gloabalProvider";

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useContext(GlobalContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
    }

    setIsSubmitting(true);

    try {
      const user = await signIn(form.email, form.password);

      if (user) {
        // Setting user details to global context porvider
        const userDetails = await getCurrentUser(user);
        setUser(userDetails);
        setIsLoggedIn(true);

        router.replace("/home");
      }
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "90%" }}>
        <View className="w-full h-full px-4 my-6 justify-center items-start">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white font-psemibold mt-10">
            Sign In
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <Link
            href="/forget-pass"
            className="text-sm text-gray-100 mt-5 text-right w-full underline px-3"
          >
            Forgot Password?
          </Link>

          <CustomButton
            title="Login"
            handlePress={submit}
            containerStyles="w-full mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex flex-row justify-center items-center gap-2 pt-5 w-full">
            <Text className="text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link href="/sign-up" className="text-secondary-200 font-psemibold">
              SignUp
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
