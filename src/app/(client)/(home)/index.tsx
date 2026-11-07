import { router, Stack } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

import { JekoColors } from '@/constants/jeko';

const MAX_CONTENT_WIDTH = 480;

function BellIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 17H5.59c-.89 0-1.34-1.08-.71-1.71L6 14.17V10a6 6 0 1 1 12 0v4.17l1.12 1.12c.63.63.18 1.71-.71 1.71H15Zm0 0v1a3 3 0 1 1-6 0v-1h6Z"
        stroke="#0F1E1B"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MapPinIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
        fill={JekoColors.emerald}
      />
      <Circle cx={12} cy={9} r={2.6} fill="#FFFFFF" />
    </Svg>
  );
}

function MotorbikeIcon({ color = '#FFFFFF' }: { color?: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={5.5} cy={17.5} r={2.5} stroke={color} strokeWidth={1.8} />
      <Circle cx={18.5} cy={17.5} r={2.5} stroke={color} strokeWidth={1.8} />
      <Path
        d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 17.5V14l-3-3 4-3 2 3h3"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M5.5 17.5 8 12h4" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
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

function ShortcutIcon({ type }: { type: 'package' | 'cart' | 'document' | 'other' }) {
  const color = JekoColors.emerald;
  if (type === 'package') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8Z" stroke={color} strokeWidth={1.8} />
        <Path d="M3.3 7 12 12l8.7-5M12 22V12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    );
  }
  if (type === 'cart') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.6L5.2 3.5A1 1 0 0 0 4.2 3H3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx={9} cy={20} r={1.3} fill={color} />
        <Circle cx={17} cy={20} r={1.3} fill={color} />
      </Svg>
    );
  }
  if (type === 'document') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
        <Path d="M14 2v5h5M9 13h6M9 17h6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    );
  }
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={1.8} />
      <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

const SHORTCUTS = [
  { key: 'package', label: 'Colis' },
  { key: 'cart', label: 'Courses' },
  { key: 'document', label: 'Documents' },
  { key: 'other', label: 'Autre' },
] as const;

const COURIERS = [
  { name: 'Kossi A.', rating: '4,8', meta: 'Moto · Bè', initial: 'K' },
  { name: 'Ama K.', rating: '4,9', meta: 'Moto · Tokoin', initial: 'A' },
  { name: 'Yao D.', rating: '4,7', meta: 'Vélo · Adidogomé', initial: 'Y' },
  { name: 'Mawuli S.', rating: '4,8', meta: 'Moto · Bè', initial: 'M' },
];

export default function ClientHomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F4F8F6]">
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: 'Accueil' }} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}>
        <View className="w-full self-center" style={{ maxWidth: MAX_CONTENT_WIDTH }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-5">
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-[#DCEFE8]">
                <Text className="font-jeko-bold text-base text-jeko-emerald">A</Text>
              </View>
              <View>
                <Text className="font-jeko-bold text-[18px] leading-6 text-[#0F1E1B]">Bonjour, Afi</Text>
                <Text className="font-jeko text-[13px] leading-[18px] text-[#5A6B66]">Lomé, Bè</Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              className="h-11 w-11 items-center justify-center rounded-full bg-white"
              style={({ pressed }) => pressed && { opacity: 0.8 }}>
              <BellIcon />
              <View className="absolute right-[10px] top-[10px] h-2 w-2 rounded-full bg-[#FD761A]" />
            </Pressable>
          </View>

          {/* Map / request card */}
          <View className="mx-5 mt-5 overflow-hidden rounded-[20px] bg-white p-3 shadow-sm">
            <View className="h-[150px] items-center justify-center overflow-hidden rounded-[14px] bg-[#EAF4F0]">
              <View className="absolute inset-0">
                <View className="absolute left-0 right-0 top-[32%] h-px bg-[#D6E6E0]" />
                <View className="absolute left-0 right-0 top-[58%] h-px bg-[#D6E6E0]" />
                <View className="absolute left-0 right-0 top-[82%] h-px bg-[#D6E6E0]" />
                <View className="absolute bottom-0 left-[22%] top-0 w-px bg-[#D6E6E0]" />
                <View className="absolute bottom-0 left-[48%] top-0 w-px bg-[#D6E6E0]" />
                <View className="absolute bottom-0 left-[74%] top-0 w-px bg-[#D6E6E0]" />
                <View className="absolute left-[38%] top-[36%] h-16 w-20 rounded-xl bg-[#DCEFE8]" />
                <View className="absolute right-[14%] top-[18%] h-10 w-14 rounded-lg bg-[#DCEFE8]" />
              </View>
              <View className="items-center">
                <MapPinIcon />
                <View className="mt-1 h-2 w-2 rounded-full bg-jeko-emerald/30" />
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Demander une course"
              className="mt-3 h-[52px] flex-row items-center justify-center gap-2 rounded-[14px] bg-jeko-emerald"
              style={({ pressed }) => [
                {
                  shadowColor: JekoColors.emerald,
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 2,
                },
                pressed && { opacity: 0.92 },
              ]}>
              <MotorbikeIcon />
              <Text className="font-jeko-semibold text-[15px] leading-5 text-white">Demander une course</Text>
            </Pressable>
          </View>

          {/* Shortcuts */}
          <View className="mt-5 flex-row justify-between px-5">
            {SHORTCUTS.map((item) => (
              <Pressable key={item.key} className="w-[72px] items-center gap-2" style={({ pressed }) => pressed && { opacity: 0.75 }}>
                <View className="h-14 w-14 items-center justify-center rounded-full bg-white">
                  <ShortcutIcon type={item.key} />
                </View>
                <Text className="text-center font-jeko-semibold text-[12px] leading-4 text-[#0F1E1B]">{item.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Couriers */}
          <View className="mt-6 px-5">
            <View className="flex-row items-center justify-between">
              <Text className="font-jeko-bold text-[17px] leading-[24px] text-[#0F1E1B]">
                Livreurs disponibles près de vous
              </Text>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Voir tout"
                onPress={() => router.push('/(client)/(home)/couriers' as import('expo-router').Href)}>
                <Text className="font-jeko-semibold text-[13px] text-jeko-emerald">Voir tout</Text>
              </Pressable>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, gap: 12, paddingBottom: 2 }}>
            {COURIERS.map((courier) => (
              <View key={courier.name} className="w-[150px] rounded-[16px] bg-white p-3">
                <View className="flex-row items-start justify-between">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-[#E6F7F2]">
                    <Text className="font-jeko-bold text-sm text-jeko-emerald">{courier.initial}</Text>
                  </View>
                  <View className="rounded-full bg-[#EAF8F1] px-2 py-1">
                    <Text className="font-jeko-semibold text-[10px] text-jeko-emerald">Disponible</Text>
                  </View>
                </View>
                <Text className="mt-2.5 font-jeko-semibold text-[14px] leading-5 text-[#0F1E1B]">{courier.name}</Text>
                <View className="mt-1 flex-row items-center gap-1">
                  <StarIcon />
                  <Text className="font-jeko-semibold text-[12px] text-[#0F1E1B]">{courier.rating}</Text>
                </View>
                <Text className="mt-1 font-jeko text-[12px] leading-4 text-[#5A6B66]">{courier.meta}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Course en cours */}
          <View className="mt-6 px-5">
            <Text className="font-jeko-bold text-[17px] leading-[24px] text-[#0F1E1B]">Course en cours</Text>
            <View className="mt-3 rounded-[16px] bg-white p-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <View className="self-start rounded-full bg-[#FFF1E8] px-2.5 py-1">
                    <Text className="font-jeko-semibold text-[11px] text-[#D85E00]">En cours</Text>
                  </View>
                  <Text className="mt-2 font-jeko-semibold text-[15px] leading-5 text-[#0F1E1B]">Bè → Tokoin</Text>
                  <Text className="mt-0.5 font-jeko text-[13px] leading-[18px] text-[#5A6B66]">1 500 FCFA</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Suivre la course"
                  className="rounded-[12px] bg-jeko-emerald px-4 py-2.5"
                  style={({ pressed }) => pressed && { opacity: 0.9 }}>
                  <Text className="font-jeko-semibold text-[13px] text-white">Suivre</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
