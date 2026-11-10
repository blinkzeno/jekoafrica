import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function NewRequestStep2Screen() {
  return (
    <View className="flex-1 bg-[#ECFDF8] items-center justify-center px-6">
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />
      <MaterialIcons name="place" size={48} color="#00614F" />
      <Text className="font-jeko-bold text-xl text-[#0F1E1B] mt-4">Étape 2 — Lieux</Text>
      <Text className="font-jeko text-sm text-[#3E4945] mt-2 text-center">
        Saisie des adresses de départ et d'arrivée (à implémenter).
      </Text>
      <View className="flex-row gap-3 mt-8">
        <View className="px-5 py-3 rounded-2xl bg-white" onTouchEnd={() => router.back()}>
          <Text className="font-jeko-semibold text-[#00614F]">Retour</Text>
        </View>
        <View className="px-5 py-3 rounded-2xl bg-[#0E7C66]" onTouchEnd={() => router.push('/(client)/new-request-step-3' as any)}>
          <Text className="font-jeko-semibold text-white">Suivant</Text>
        </View>
      </View>
    </View>
  );
}
