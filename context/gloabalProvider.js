import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // const hanldeIsVideoPlaying = () => {
  //   if (isVideoPlaying) {
  //     setIsVideoPlaying(!isVideoPlaying);
  //   }
  // };

  useEffect(() => {
    const CurrentUSerInfo = async () => {
      try {
        const res = await getCurrentUser();

        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    CurrentUSerInfo();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        setIsLoading,
        // isVideoPlaying,
        // hanldeIsVideoPlaying,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
