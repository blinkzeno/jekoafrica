import { router, Stack, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

import { JekoColors } from '@/constants/jeko';
import { MOCK_COURIERS } from '@/data/mockCouriers';

const MAX_CONTENT_WIDTH = 480;

function BackIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke="#0F1E1B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SearchIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke="#7A8F88" strokeWidth={1.8} />
      <Path d="M20 20l-3.5-3.5" stroke="#7A8F88" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function StarIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="#F59E0B">
      <Path d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.53L12 17.49l-5.87 3.08 1.12-6.53L2.5 9.41l6.56-.95L12 2.5Z" />
    </Svg>
  );
}

const FILTERS = ['Disponible maintenant', 'Note 4+', 'Moto', 'Tricycle'];

type CourierListItem = {
  id: string;
  name: string;
  rating: string;
  reviews: string;
  vehicle: string;
  zones: string[];
  distance: string;
  available: boolean;
  initial: string;
};

const DISTANCES = ['1,2 km', '0,8 km', '2,1 km', '1,5 km', '0,6 km'];
const VEHICLE_SUMMARY: Record<string, string> = {
  'kossi-amegah': 'Moto Yamaha',
  'ama-kossi': 'Moto TVS',
  'yao-dossou': 'Tricycle',
  'mawuli-sodji': 'Moto Yamaha',
  'edem-tete': 'Vélo',
};

const COURIERS: CourierListItem[] = MOCK_COURIERS.map((c, i) => ({
  id: c.id,
  name: `${c.firstName} ${c.lastName.charAt(0)}.`,
  rating: c.rating,
  reviews: c.reviewsCount,
  vehicle: VEHICLE_SUMMARY[c.id] ?? c.vehicle,
  zones: c.zones.slice(0, 2),
  distance: DISTANCES[i] ?? '1,0 km',
  available: c.available,
  initial: c.initial,
}));

export default function CouriersListScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState('Disponible maintenant');
  const [query, setQuery] = useState('');

  return (
    <View className="flex-1 bg-[#F4F8F6]">
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: 'Livreurs près de vous' }} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="w-full self-center" style={{ maxWidth: MAX_CONTENT_WIDTH }}>
          {/* Header */}
          <View className="flex-row items-center gap-2 px-5">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retour"
              hitSlop={8}
              onPress={() => router.back()}
              className="-ml-2 h-10 w-10 items-center justify-center rounded-full"
              style={({ pressed }) => pressed && { backgroundColor: '#EEF3F1' }}>
              <BackIcon />
            </Pressable>
            <Text className="font-jeko-bold text-[20px] leading-7 tracking-[-0.3px] text-[#0F1E1B]">
              Livreurs près de vous
            </Text>
          </View>

          {/* Search */}
          <View className="px-5 pt-4">
            <View className="h-[48px] flex-row items-center gap-2 rounded-[14px] border border-[#DCE8E3] bg-white px-3">
              <SearchIcon />
              <TextInput
                className="h-full flex-1 font-jeko text-[14px] text-[#0F1E1B]"
                value={query}
                onChangeText={setQuery}
                placeholder="Rechercher un livreur ou un quartier"
                placeholderTextColor="#9AABA5"
                selectionColor={JekoColors.emerald}
              />
            </View>
          </View>

          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, gap: 8 }}>
            {FILTERS.map((filter) => {
              const selected = selectedFilter === filter;
              return (
                <Pressable
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  className={`rounded-full px-3.5 py-2 ${selected ? 'bg-jeko-emerald' : 'border border-[#DCE8E3] bg-white'}`}>
                  <Text className={`font-jeko-semibold text-[12px] ${selected ? 'text-white' : 'text-[#0F1E1B]'}`}>
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* List */}
          <View className="gap-3 px-5 pt-4">
            {COURIERS.map((courier) => (
              <View key={courier.name} className={`rounded-[16px] bg-white p-4 ${courier.available ? '' : 'opacity-70'}`}>
                <View className="flex-row">
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-[#E6F7F2]">
                    <Text className="font-jeko-bold text-base text-jeko-emerald">{courier.initial}</Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-2">
                        <Text className="font-jeko-semibold text-[15px] leading-5 text-[#0F1E1B]">{courier.name}</Text>
                        <View className="mt-1 flex-row items-center gap-1">
                          <StarIcon />
                          <Text className="font-jeko-semibold text-[12px] text-[#0F1E1B]">{courier.rating}</Text>
                          <Text className="font-jeko text-[12px] text-[#5A6B66]">({courier.reviews})</Text>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-1.5">
                        <View className={`h-2 w-2 rounded-full ${courier.available ? 'bg-[#22C55E]' : 'bg-[#9CA3AF]'}`} />
                        <Text className={`font-jeko-semibold text-[11px] ${courier.available ? 'text-[#16A34A]' : 'text-[#6B7280]'}`}>
                          {courier.available ? 'Disponible' : 'Indisponible'}
                        </Text>
                      </View>
                    </View>

                    <Text className="mt-1 font-jeko text-[13px] text-[#5A6B66]">
                      {courier.vehicle} · <Text className="font-jeko-semibold text-[#0F1E1B]">{courier.distance}</Text>
                    </Text>

                    <View className="mt-2 flex-row flex-wrap gap-1.5">
                      {courier.zones.map((zone) => (
                        <View key={zone} className="rounded-full bg-[#F1F4F3] px-2.5 py-1">
                          <Text className="font-jeko-semibold text-[11px] text-[#5A6B66]">{zone}</Text>
                        </View>
                      ))}
                    </View>

                    <View className="mt-3 items-start">
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Voir le profil de ${courier.name}`}
                        onPress={() => router.push(`/(client)/(home)/courier/${courier.id}` as Href)}
                        className="rounded-[10px] border border-jeko-emerald px-3 py-1.5"
                        style={({ pressed }) => pressed && { backgroundColor: '#F3FBF8' }}>
                        <Text className="font-jeko-semibold text-[12px] text-jeko-emerald">Voir le profil</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
