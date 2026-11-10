import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function NewRequestStep3Screen() {
  return (
    <View className="flex-1 bg-[#ECFDF8] items-center justify-center px-6">
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />
      <MaterialIcons name="receipt-long" size={48} color="#00614F" />
      <Text className="font-jeko-bold text-xl text-[#0F1E1B] mt-4">Étape 3 — Résumé</Text>
      <Text className="font-jeko text-sm text-[#3E4945] mt-2 text-center">
        Récapitulatif et confirmation (à implémenter).
      </Text>
      <View className="px-5 py-3 rounded-2xl bg-[#0E7C66] mt-8" onTouchEnd={() => router.replace('/')}>
        <Text className="font-jeko-semibold text-white">Confirmer</Text>
      </View>
    </View>
  );
}
