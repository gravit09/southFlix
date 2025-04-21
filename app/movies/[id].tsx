import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Dimensions,
  ActivityIndicator,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import sample from "../data/sample.json";

const { width } = Dimensions.get("window");
const VIDEO_HEIGHT = width * (9 / 16) * 1.2;

const Movie = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const movie = sample.find((item) => item.id === id);

  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  };

  const formatDate = (dateString: string) => {
    const videoDate = new Date(dateString);
    return videoDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const handleScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY < -50) {
      // If pulled down more than 50 units
      router.back();
    }
  };

  const isFavourite = async () => {
    try {
      const favourites = await AsyncStorage.getItem("favourites");
      if (favourites) {
        const parsedFavourites = JSON.parse(favourites);
        const isFavourited = parsedFavourites.some(
          (item: any) => item.id === id
        );
        setIsFavourited(isFavourited);
      }
    } catch (error) {
      console.error("Error checking favourites:", error);
    }
  };

  const toggleFavourite = async () => {
    try {
      const favourites = await AsyncStorage.getItem("favourites");
      const parsedFavourites = favourites ? JSON.parse(favourites) : [];
      if (isFavourited) {
        const updatedFavourites = parsedFavourites.filter(
          (item: any) => item.id !== id
        );
        await AsyncStorage.setItem(
          "favourites",
          JSON.stringify(updatedFavourites)
        );
        setIsFavourited(false);
      } else {
        const updatedFavourites = [...parsedFavourites, movie];
        await AsyncStorage.setItem(
          "favourites",
          JSON.stringify(updatedFavourites)
        );
        setIsFavourited(true);
      }
    } catch (error) {
      console.error("Error toggling favourites:", error);
    }
  };

  useEffect(() => {
    isFavourite();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Animated.ScrollView
        className="flex-1"
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
      >
        <View className="flex-1 bg-black">
          {isLoading && (
            <View className="absolute inset-0 justify-center items-center">
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          )}

          {error ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-white text-lg">Error loading video</Text>
            </View>
          ) : (
            <YoutubePlayer
              height={VIDEO_HEIGHT}
              width={width}
              play={true}
              videoId={id as string}
              onReady={() => setIsLoading(false)}
              onError={() => {
                setError(true);
                setIsLoading(false);
              }}
              webViewProps={{
                allowsFullscreenVideo: true,
              }}
            />
          )}
        </View>

        <View className="p-4">
          <Text className="text-white text-xl font-bold mb-2">
            {movie?.title}
          </Text>

          <View className="flex-row items-center mb-2">
            <Text className="text-gray-400 text-sm">
              {formatViews(movie?.viewCount || 0)} •{" "}
              {formatDate(movie?.date || "")}
            </Text>
          </View>

          <View className="flex-row items-center mb-4">
            <Ionicons name="heart" color="red" size={16} />
            <Text className="text-gray-400 text-sm ml-1">
              {movie?.likes || 0} likes
            </Text>
          </View>

          <View className="border-t border-gray-800 pt-4">
            <View className="flex-row items-center mb-2">
              <Text className="text-white font-semibold">Channel: </Text>
              <Text className="text-gray-400">{movie?.channelName}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white font-semibold">Duration: </Text>
              <Text className="text-gray-400">{movie?.duration}</Text>
            </View>
            <TouchableOpacity
              className="mt-4 bg-gray-500 rounded-full px-4 py-4"
              onPress={toggleFavourite}
            >
              <Text className="text-white text-center font-semibold">
                {isFavourited ? "Remove Favourite" : "Add to Favourite"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default Movie;
