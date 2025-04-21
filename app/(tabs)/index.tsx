import { Text, FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import sample from "../data/sample.json";
import MovieCard from "../../components/movieCard";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const [shuffledMovies, setShuffledMovies] = useState<typeof sample>([]);

  const shuffleArray = (array: typeof sample) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const refreshMovies = () => {
    setShuffledMovies(shuffleArray(sample));
  };

  useEffect(() => {
    refreshMovies();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <View className="flex-row justify-between items-center px-6 pt-2 pb-4">
        <Text className="text-white text-2xl font-bold">Featured Movies</Text>
        <TouchableOpacity
          onPress={refreshMovies}
          className="flex-row items-center"
        >
          <Ionicons name="refresh" size={24} color="gray" />
          <Text className="text-gray-400 ml-1">Refresh</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={shuffledMovies}
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
    </SafeAreaView>
  );
};

export default Home;
