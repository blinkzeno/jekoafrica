import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

import { JekoColors } from '@/constants/jeko';
import { getCourierById } from '@/data/mockCouriers';

const MAX_CONTENT_WIDTH = 480;

function BackIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke="#0F1E1B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShareIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" stroke="#0F1E1B" strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M12 16V4m0 0-4 4m4-4 4 4" stroke="#0F1E1B" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShieldCheckIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2.5 19 5.5v6c0 5-3.4 8.7-7 10-3.6-1.3-7-5-7-10v-6l7-3Z" fill={JekoColors.emerald} />
      <Path d="m9 12 2 2 4-4" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill={filled ? '#F59E0B' : '#D1D5DB'}>
      <Path d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.53L12 17.49l-5.87 3.08 1.12-6.53L2.5 9.41l6.56-.95L12 2.5Z" />
    </Svg>
  );
}

function WhatsAppIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 11.5a8.5 8.5 0 0 1-12.6 7.5L4 20l1.1-3.3A8.5 8.5 0 1 1 20 11.5Z"
        stroke={JekoColors.emerald}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M9.2 8.8c.2-.5.4-.5.6-.5h.5c.1 0 .4 0 .5.4l.7 1.7c.1.2.1.4 0 .6l-.3.4c-.1.1-.2.3 0 .5.2.4.8 1.3 1.9 2 .9.6 1.3.7 1.6.6.2-.1.4-.4.6-.7.1-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.4 0 .2.1 1-.3 1.5-.4.5-1.3.8-2.5.5-1.2-.3-2.7-1.1-3.8-2.2-1.4-1.4-2.2-3-2.4-3.5-.2-.5 0-1.6.4-2.4Z"
        fill={JekoColors.emerald}
      />
    </Svg>
  );
}

export default function CourierProfileScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const courier = getCourierById(typeof id === 'string' ? id : undefined) ?? getCourierById('kossi-amegah');

  if (!courier) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F4F8F6]">
        <Text className="font-jeko text-[#5A6B66]">Livreur introuvable.</Text>
      </View>
    );
  }

  const openWhatsApp = () => {
    const url = `https://wa.me/${courier.whatsappPhone}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View className="flex-1 bg-[#F4F8F6]">
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: `${courier.firstName} ${courier.lastName}` }} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        <View className="w-full self-center" style={{ maxWidth: MAX_CONTENT_WIDTH }}>
          {/* Top bar */}
          <View className="flex-row items-center justify-between px-5">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retour"
              hitSlop={8}
              onPress={() => router.back()}
              className="-ml-2 h-10 w-10 items-center justify-center rounded-full"
              style={({ pressed }) => pressed && { backgroundColor: '#EEF3F1' }}>
              <BackIcon />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Partager"
              hitSlop={8}
              className="h-10 w-10 items-center justify-center rounded-full"
              style={({ pressed }) => pressed && { backgroundColor: '#EEF3F1' }}>
              <ShareIcon />
            </Pressable>
          </View>

          {/* Profile header */}
          <View className="items-center px-5 pt-2">
            <View className="h-[96px] w-[96px] items-center justify-center rounded-full bg-[#DCEFE8]">
              <Text className="font-jeko-bold text-[34px] text-jeko-emerald">{courier.initial}</Text>
            </View>
            <Text className="mt-3 text-center font-jeko-bold text-[22px] leading-7 text-[#0F1E1B]">
              {courier.firstName} {courier.lastName}
            </Text>
            {courier.verified ? (
              <View className="mt-2 flex-row items-center gap-1.5 rounded-full bg-[#EAF8F1] px-3 py-1.5">
                <ShieldCheckIcon />
                <Text className="font-jeko-semibold text-[12px] text-jeko-emerald">Identité vérifiée</Text>
              </View>
            ) : null}
            <View className="mt-2 flex-row items-center gap-1">
              <Text className="font-jeko-semibold text-[14px] text-[#0F1E1B]">{courier.rating} ★</Text>
              <Text className="font-jeko text-[14px] text-[#5A6B66]">({courier.reviewsCount})</Text>
            </View>
          </View>

          {/* Stats */}
          <View className="mt-5 flex-row gap-2 px-5">
            <View className="flex-1 items-center rounded-[14px] bg-white px-2 py-3">
              <Text className="text-center font-jeko-bold text-[14px] leading-5 text-[#0F1E1B]">{courier.stats.courses}</Text>
            </View>
            <View className="flex-1 items-center rounded-[14px] bg-white px-2 py-3">
              <Text className="text-center font-jeko-bold text-[13px] leading-5 text-[#0F1E1B]">{courier.stats.seniority}</Text>
            </View>
            <View className="flex-1 items-center rounded-[14px] bg-white px-2 py-3">
              <Text className="text-center font-jeko-bold text-[14px] leading-5 text-[#0F1E1B]">{courier.stats.punctuality}</Text>
            </View>
          </View>

          {/* Vehicle */}
          <View className="mt-4 px-5">
            <View className="rounded-[16px] bg-white p-4">
              <Text className="font-jeko-semibold text-[13px] text-[#5A6B66]">Engin</Text>
              <Text className="mt-1 font-jeko-semibold text-[15px] leading-[22px] text-[#0F1E1B]">{courier.vehicle}</Text>
            </View>
          </View>

          {/* Zones */}
          <View className="mt-3 px-5">
            <View className="rounded-[16px] bg-white p-4">
              <Text className="font-jeko-semibold text-[13px] text-[#5A6B66]">Zones couvertes</Text>
              <View className="mt-2.5 flex-row flex-wrap gap-2">
                {courier.zones.map((zone) => (
                  <View key={zone} className="rounded-full bg-[#F1F4F3] px-3 py-1.5">
                    <Text className="font-jeko-semibold text-[12px] text-[#4B5E58]">{zone}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Reviews */}
          <View className="mt-5 px-5">
            <Text className="font-jeko-bold text-[17px] leading-6 text-[#0F1E1B]">Avis récents</Text>
            <View className="mt-3 gap-2.5">
              {courier.reviews.map((review, idx) => (
                <View key={`${review.firstName}-${idx}`} className="rounded-[16px] bg-white p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-jeko-semibold text-[14px] text-[#0F1E1B]">{review.firstName}</Text>
                    <Text className="font-jeko text-[12px] text-[#7A8F88]">{review.date}</Text>
                  </View>
                  <View className="mt-1 flex-row gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} filled={i < review.rating} />
                    ))}
                  </View>
                  <Text className="mt-2 font-jeko text-[14px] leading-5 text-[#374743]">{review.comment}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-[#E6EEEB] bg-white px-5 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
        <View className="mx-auto w-full flex-row gap-3" style={{ maxWidth: MAX_CONTENT_WIDTH }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Écrire sur WhatsApp"
            onPress={openWhatsApp}
            className="h-[50px] flex-1 flex-row items-center justify-center gap-2 rounded-[14px] border border-jeko-emerald bg-white"
            style={({ pressed }) => pressed && { backgroundColor: '#F3FBF8' }}>
            <WhatsAppIcon />
            <Text className="font-jeko-semibold text-[13px] text-jeko-emerald">Écrire sur WhatsApp</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Demander une course"
            onPress={() => {
              // TODO: start a delivery request with this courier.
            }}
            className="h-[50px] flex-1 items-center justify-center rounded-[14px] bg-jeko-emerald"
            style={({ pressed }) => [
              {
                shadowColor: JekoColors.emerald,
                shadowOpacity: 0.18,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
              },
              pressed && { opacity: 0.92 },
            ]}>
            <Text className="font-jeko-semibold text-[13px] text-white">Demander une course</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
