import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#F7FBF9] px-6">
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: 'Profil' }} />
      <Text className="font-jeko-bold text-xl text-[#0F1E1B]">Profil</Text>
      <Text className="mt-2 text-center font-jeko text-sm text-[#5A6B66]">
        Vos informations de profil apparaîtront ici.
      </Text>
    </View>
  );
}
