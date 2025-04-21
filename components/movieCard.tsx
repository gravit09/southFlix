import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const YouTubeStyleCard = ({
  title,
  id,
  url,
  viewCount,
  date,
  likes,
  duration,
}: {
  title: string;
  id: string;
  url: string;
  viewCount: number;
  date: string;
  likes: number;
  duration: string;
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  };

  const formatLikes = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return `${count}`;
  };

  const formatDate = (dateString: string) => {
    const videoDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - videoDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  };

  const thumbnailUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  const addToHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("history");
      console.log(history);
      let historyArray: string[] = [];

      if (history) {
        historyArray = JSON.parse(history);
      }
      // Remove the movie if it already exists in history
      historyArray = historyArray.filter((movieId) => movieId !== id);
      // Add the movie to the beginning of the array
      historyArray.unshift(id);

      // Keep only the last 50 watched movies
      if (historyArray.length > 50) {
        historyArray = historyArray.slice(0, 50);
      }
      await AsyncStorage.setItem("history", JSON.stringify(historyArray));
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };

  return (
    <TouchableOpacity
      className="w-full mb-4 active:opacity-80"
      activeOpacity={0.7}
      onPress={() => {
        addToHistory();
        router.push(`/movies/${id}`);
      }}
    >
      <View className="relative">
        {isLoading && (
          <View className="w-full h-56 rounded-lg bg-gray-800 items-center justify-center">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}

        {!imageError ? (
          <Image
            source={{ uri: thumbnailUrl }}
            className="w-full h-56 rounded-lg"
            resizeMode="cover"
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setImageError(true);
              setIsLoading(false);
            }}
          />
        ) : (
          <View className="w-full h-56 rounded-lg bg-gray-800 items-center justify-center">
            <Ionicons name="videocam-off" size={32} color="#ffffff" />
            <Text className="text-white text-center mt-2">
              No Preview Available
            </Text>
          </View>
        )}

        <View className="absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100">
          <View className="bg-black bg-opacity-50 rounded-full p-3">
            <Ionicons name="play" size={24} color="#ffffff" />
          </View>
        </View>

        {duration && (
          <View className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded">
            <Text className="text-white text-xs font-medium">{duration}</Text>
          </View>
        )}
      </View>

      <View className="mt-2">
        <Text
          className="text-white font-semibold text-base leading-5"
          numberOfLines={2}
        >
          {title}
        </Text>

        <View className="flex-row mt-1 items-center">
          <Text className="text-gray-400 text-xs">
            {formatViews(viewCount)} • {formatDate(date)}
          </Text>
        </View>

        <View className="flex-row mt-2 items-center">
          <Ionicons name="heart" color="red" size={16} />
          <Text className="text-gray-400 text-md ml-1">
            {formatLikes(likes)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default YouTubeStyleCard;
