import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sample from "../data/sample.json";
import MovieCard from "../../components/movieCard";
import { useFocusEffect } from "@react-navigation/native";

const History = () => {
  const [watchedMovies, setWatchedMovies] = useState<typeof sample>([]);
  const [loading, setLoading] = useState(true);

  const loadWatchedMovies = async () => {
    try {
      const history = await AsyncStorage.getItem("history");
      if (history) {
        const historyArray = JSON.parse(history);
        const watched = sample.filter((movie) =>
          historyArray.includes(movie.id)
        );
        setWatchedMovies(watched);
      } else {
        setWatchedMovies([]);
      }
    } catch (error) {
      console.error("Error loading watch history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load history when component mounts
  useEffect(() => {
    loadWatchedMovies();
  }, []);

  // Reload history when tab is focused
  useFocusEffect(
    React.useCallback(() => {
      loadWatchedMovies();
    }, [])
  );

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem("history");
      setWatchedMovies([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <View className="flex-row justify-between items-center px-4 py-2">
        <Text className="text-white text-2xl font-bold">Watch History</Text>
        {watchedMovies.length > 0 && (
          <TouchableOpacity
            onPress={clearHistory}
            className="flex-row items-center"
          >
            <Ionicons name="trash-outline" size={24} color="gray" />
            <Text className="text-gray-400 ml-1">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {watchedMovies.length > 0 ? (
        <FlatList
          data={watchedMovies}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MovieCard
              title={item.title || ""}
              id={item.id || ""}
              url={item.url || ""}
              viewCount={item.viewCount || 0}
              date={item.date || ""}
              likes={item.likes || 0}
              duration={item.duration || ""}
            />
          )}
          keyExtractor={(item) => item.id || ""}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="time-outline" size={64} color="gray" />
          <Text className="text-gray-400 text-lg mt-4">
            No watch history yet
          </Text>
          <Text className="text-gray-500 text-sm mt-2">
            Movies you watch will appear here
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default History;
