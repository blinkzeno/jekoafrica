import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import MapBackButton from '@/components/features/map/MapBackButton';
import MiniMap from '@/components/features/map/MiniMap';
import { JekoColors, JekoFonts } from '@/constants/jeko';

export default function NearbyScreen() {
  return (
    <View className="flex-1 bg-[#F4F8F6]">
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: 'Livreurs autour de moi',
          headerShown: true,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: JekoColors.emeraldDeep,
          headerTitleStyle: { fontFamily: JekoFonts.semibold, fontSize: 16 },
          headerShadowVisible: false,
          headerLeft: () => <MapBackButton />,
        }}
      />
      <MiniMap showExpand={false} />
    </View>
  );
}
