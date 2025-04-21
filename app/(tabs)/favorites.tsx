import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MovieCard from "../../components/movieCard";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const favourite = () => {
  interface Favourite {
    id: string;
    title: string;
    url: string;
    viewCount: number;
    date: string;
    likes: number;
    duration: string;
  }

  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchFavourites = async () => {
    try {
      const storedFavourites = await AsyncStorage.getItem("favourites");
      if (storedFavourites) {
        const parsedFavourites = JSON.parse(storedFavourites);
        setFavourites(parsedFavourites);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching favourites:", error);
      setError(true);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavourites();
    }, [])
  );

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <SafeAreaView className="bg-black flex-1" edges={["top"]}>
      <View className="flex-row justify-between items-center px-4 py-2">
        <Text className="text-white text-2xl font-bold">Favourites</Text>
      </View>
      {favourite.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="heart" size={64} color="gray" />
          <Text className="text-gray-400 text-lg mt-4">No Favourite yet</Text>
          <Text className="text-gray-500 text-sm mt-2">
            Movies you favourite will appear here
          </Text>
        </View>
      )}
      <FlatList
        data={favourites}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id || ""}
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
      />
    </SafeAreaView>
  );
};

export default favourite;
