import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="couriers" />
      <Stack.Screen name="courier/[id]" />
      <Stack.Screen name="live-map" />
      <Stack.Screen name="nearby" />
    </Stack>
  );
}
