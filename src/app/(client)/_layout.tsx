import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

import { JekoColors } from '@/constants/jeko';

function HomeIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
  const stroke = String(color);
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z"
        stroke={stroke}
        strokeWidth={focused ? 2 : 1.8}
        strokeLinejoin="round"
        fill={focused ? `${stroke}22` : 'none'}
      />
    </Svg>
  );
}

function CoursesIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
  const stroke = String(color);
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={4} width={16} height={16} rx={3} stroke={stroke} strokeWidth={focused ? 2 : 1.8} />
      <Path d="M8 9h8M8 13h8M8 17h5" stroke={stroke} strokeWidth={focused ? 2 : 1.8} strokeLinecap="round" />
    </Svg>
  );
}

function ProfileIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
  const stroke = String(color);
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={3.5} stroke={stroke} strokeWidth={focused ? 2 : 1.8} />
      <Path
        d="M4.5 20a7.5 7.5 0 0 1 15 0"
        stroke={stroke}
        strokeWidth={focused ? 2 : 1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function ClientTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: JekoColors.emerald,
        tabBarInactiveTintColor: '#7A8F88',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8EFEA',
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'PlusJakartaSans_600SemiBold',
        },
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused }) => <HomeIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Mes courses',
          tabBarIcon: ({ color, focused }) => <CoursesIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => <ProfileIcon color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
