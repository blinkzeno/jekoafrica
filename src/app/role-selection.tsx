import { router, Stack, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

import { JekoColors } from '@/constants/jeko';

const TEXT = '#0F1E1B';
const TEXT_MUTED = '#5A6B66';
const MAX_CONTENT_WIDTH = 480;
const SELECTED_BG = '#EEF8F4';

type Role = 'sender' | 'courier';

function BackIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18l-6-6 6-6"
        stroke={TEXT}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CheckBadge() {
  return (
    <View className="absolute right-3 top-3 h-6 w-6 items-center justify-center rounded-full bg-jeko-emerald">
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <Path
          d="M5 13l4 4L19 7"
          stroke="#FFFFFF"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

function PackageIcon({ active }: { active?: boolean }) {
  const color = active ? JekoColors.emerald : TEXT;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.5 9.4 7.55 4.24M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MotorbikeIcon({ active }: { active?: boolean }) {
  const color = active ? JekoColors.emerald : TEXT;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
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
      <Path d="M18.5 17.5 16 12h-1" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function RoleCard({
  role,
  selected,
  onSelect,
  icon,
  title,
  description,
}: {
  role: Role;
  selected: boolean;
  onSelect: (role: Role) => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={title}
      onPress={() => onSelect(role)}
      className="relative w-full flex-row items-start gap-4 rounded-[16px] px-4 py-4"
      style={{
        borderWidth: selected ? 2 : 1.2,
        borderColor: selected ? JekoColors.emerald : '#DCE8E3',
        backgroundColor: selected ? SELECTED_BG : '#FFFFFF',
      }}>
      {selected ? <CheckBadge /> : null}
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: selected ? '#FFFFFF' : '#F3F6F5' }}>
        {icon}
      </View>
      <View className="flex-1 pr-6">
        <Text className="font-jeko-semibold text-[16px] leading-[22px] text-[#0F1E1B]">{title}</Text>
        <Text className="mt-1 font-jeko text-[14px] leading-[20px] text-[#5A6B66]">{description}</Text>
      </View>
    </Pressable>
  );
}

export default function RoleSelectionScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Role>('sender');

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: 'Choisir un rôle', headerShown: false }} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 8,
          paddingBottom: Math.max(insets.bottom, 16) + 16,
        }}
        keyboardShouldPersistTaps="handled">
        <View className="w-full flex-1 self-center px-5" style={{ maxWidth: MAX_CONTENT_WIDTH }}>
          <View className="h-12 items-start justify-center">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retour"
              hitSlop={8}
              onPress={() => router.back()}
              className="-ml-[10px] h-11 w-11 items-center justify-center rounded-[22px]"
              style={({ pressed }) => pressed && { backgroundColor: '#EEF6F2' }}>
              <BackIcon />
            </Pressable>
          </View>

          <Text className="mt-1 font-jeko-bold text-[27px] leading-[34px] tracking-[-0.4px] text-[#0F1E1B]">
            Comment voulez-vous utiliser Jeko ?
          </Text>
          <Text className="mt-1.5 font-jeko text-[15px] leading-[22px] text-[#5A6B66]">
            Vous pourrez changer plus tard
          </Text>

          <View className="mt-7 gap-3">
            <RoleCard
              role="sender"
              selected={selected === 'sender'}
              onSelect={setSelected}
              icon={<PackageIcon active={selected === 'sender'} />}
              title="Je cherche un livreur"
              description="Faites livrer un colis ou faire une course près de chez vous"
            />
            <RoleCard
              role="courier"
              selected={selected === 'courier'}
              onSelect={setSelected}
              icon={<MotorbikeIcon active={selected === 'courier'} />}
              title="Je suis livreur"
              description="Recevez des demandes de courses et gagnez de l'argent"
            />
          </View>

          <View className="mt-auto pt-8">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continuer"
              onPress={() => {
                // TODO: persist role and navigate based on selection.
                if (selected === 'sender') {
                  router.replace('/(client)/(home)' as Href);
                } else {
                  router.back();
                }
              }}
              className="h-[52px] w-full items-center justify-center rounded-[14px] bg-jeko-emerald"
              style={({ pressed }) => [
                {
                  shadowColor: JekoColors.emerald,
                  shadowOpacity: 0.22,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 5 },
                  elevation: 3,
                },
                pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
              ]}>
              <Text className="font-jeko-semibold text-[15px] leading-5 text-white">Continuer</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
