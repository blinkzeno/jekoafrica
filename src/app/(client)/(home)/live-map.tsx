import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import LiveMap from '@/components/features/map/LiveMap';
import MapBackButton from '@/components/features/map/MapBackButton';
import { JekoColors, JekoFonts } from '@/constants/jeko';

export default function LiveMapScreen() {
  return (
    <View className="flex-1 bg-[#F4F8F6]">
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: 'Carte en direct',
          headerShown: true,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: JekoColors.emeraldDeep,
          headerTitleStyle: { fontFamily: JekoFonts.semibold, fontSize: 16 },
          headerShadowVisible: false,
          headerLeft: () => <MapBackButton />,
        }}
      />
      <LiveMap />
    </View>
  );
}
