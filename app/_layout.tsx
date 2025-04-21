import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "black" },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="movies/[id]" />
    </Stack>
  );
}
