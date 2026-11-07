import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function CoursesScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#F7FBF9] px-6">
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: 'Mes courses' }} />
      <Text className="font-jeko-bold text-xl text-[#0F1E1B]">Mes courses</Text>
      <Text className="mt-2 text-center font-jeko text-sm text-[#5A6B66]">
        L’historique de vos courses apparaîtra ici.
      </Text>
    </View>
  );
}
