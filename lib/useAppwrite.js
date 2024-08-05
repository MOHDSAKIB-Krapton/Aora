import { useEffect, useState } from "react";
import { Alert } from "react-native";

// Custom Hooks
const useAppwrite = (func) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const res = await func();
      setData(res);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  //  fetching data in start
  useEffect(() => {
    fetchData();
  }, []);

  //   and whenever refetch is called
  const reFetch = () => fetchData();

  return { data, isLoading, setIsLoading, reFetch };
};

export default useAppwrite;
