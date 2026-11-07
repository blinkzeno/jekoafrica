import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

import { JekoColors } from '@/constants/jeko';

const TEXT = '#0F1E1B';
const TEXT_MUTED = '#5A6B66';
const BORDER = '#DCE8E3';
const MAX_CONTENT_WIDTH = 480;

function BrandPin() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={JekoColors.emerald}
        fillOpacity={0.18}
      />
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
        fill={JekoColors.emerald}
      />
      <Circle cx={17.5} cy={18.5} r={2.5} fill={JekoColors.accent} />
    </Svg>
  );
}

function EyeIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
        stroke={TEXT_MUTED}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={TEXT_MUTED} strokeWidth={1.8} />
    </Svg>
  );
}

function EyeOffIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4l16 16M9.9 5.1A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.3 4.3M6.1 6.9A17 17 0 0 0 2 12s3.5 7 10 7c1.5 0 2.9-.4 4.1-1"
        stroke={TEXT_MUTED}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
        stroke={TEXT_MUTED}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function TogoFlag() {
  return (
    <View className="overflow-hidden rounded-[3px]">
      <Svg width={22} height={14} viewBox="0 0 500 300">
        <Rect width={500} height={60} y={0} fill="#006A4E" />
        <Rect width={500} height={60} y={60} fill="#FFCE00" />
        <Rect width={500} height={60} y={120} fill="#006A4E" />
        <Rect width={500} height={60} y={180} fill="#FFCE00" />
        <Rect width={500} height={60} y={240} fill="#006A4E" />
        <Rect width={180} height={180} fill="#D21034" />
        <Polygon
          points="90,28 108,82 166,82 119,116 137,171 90,137 43,171 61,116 14,82 72,82"
          fill="#FFFFFF"
        />
      </Svg>
    </View>
  );
}

function formatTogoPhone(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const phoneDigits = useMemo(() => phone.replace(/\D/g, ''), [phone]);

  const handleLogin = () => {
    if (phoneDigits.length !== 8) {
      Alert.alert('Téléphone', 'Entrez les 8 chiffres de votre numéro.');
      return;
    }
    if (password.length < 1) {
      Alert.alert('Mot de passe', 'Entrez votre mot de passe.');
      return;
    }
    Alert.alert('Connexion', 'La connexion sera disponible prochainement.');
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: 'Connexion', headerShown: false }} />

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 20,
            paddingBottom: Math.max(insets.bottom, 16) + 20,
          }}
          keyboardShouldPersistTaps="handled">
          <View className="w-full self-center px-5" style={{ maxWidth: MAX_CONTENT_WIDTH }}>
            {/* Logo */}
            <View className="items-center gap-2 pt-2">
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#E6F7F2]">
                <BrandPin />
              </View>
              <Text className="font-jeko-bold text-lg tracking-[-0.3px] text-[#0F1E1B]">Jeko</Text>
            </View>

            {/* Title */}
            <View className="mt-8 items-center gap-1.5">
              <Text className="text-center font-jeko-bold text-[26px] leading-[34px] tracking-[-0.4px] text-[#0F1E1B]">
                Bon retour parmi nous
              </Text>
              <Text className="text-center font-jeko text-[15px] leading-[22px] text-[#5A6B66]">
                Connectez-vous pour continuer
              </Text>
            </View>

            {/* Form */}
            <View className="mt-8 gap-4">
              <View className="gap-1.5">
                <Text className="font-jeko-semibold text-[13px] leading-[18px] text-[#0F1E1B]">Téléphone</Text>
                <View
                  className="h-[52px] flex-row items-center rounded-[14px] bg-white px-[14px]"
                  style={{ borderWidth: 1.2, borderColor: phoneFocused ? JekoColors.emerald : BORDER }}>
                  <View className="h-full flex-row items-center gap-2 border-r border-[#DCE8E3] pr-3">
                    <TogoFlag />
                    <Text className="font-jeko-semibold text-[15px] text-[#0F1E1B]">+228</Text>
                  </View>
                  <TextInput
                    className="h-full flex-1 pl-3 font-jeko text-base text-[#0F1E1B]"
                    value={phone}
                    onChangeText={(t) => setPhone(formatTogoPhone(t))}
                    onFocus={() => setPhoneFocused(true)}
                    onBlur={() => setPhoneFocused(false)}
                    placeholder="90 12 34 56"
                    placeholderTextColor="#9AABA5"
                    keyboardType="number-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    maxLength={11}
                    selectionColor={JekoColors.emerald}
                    testID="login-phone"
                  />
                </View>
              </View>

              <View className="gap-1.5">
                <Text className="font-jeko-semibold text-[13px] leading-[18px] text-[#0F1E1B]">Mot de passe</Text>
                <View
                  className="h-[52px] flex-row items-center rounded-[14px] bg-white px-[14px]"
                  style={{ borderWidth: 1.2, borderColor: passwordFocused ? JekoColors.emerald : BORDER }}>
                  <TextInput
                    className="h-full flex-1 font-jeko text-base text-[#0F1E1B]"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="Votre mot de passe"
                    placeholderTextColor="#9AABA5"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    selectionColor={JekoColors.emerald}
                    testID="login-password"
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    hitSlop={8}
                    onPress={() => setShowPassword((v) => !v)}
                    className="h-10 w-10 items-center justify-center">
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </Pressable>
                </View>
                <View className="items-end pt-0.5">
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel="Mot de passe oublié"
                    hitSlop={8}
                    onPress={() =>
                      Alert.alert('Récupération', 'La récupération du mot de passe sera disponible prochainement.')
                    }>
                    <Text className="font-jeko-semibold text-[13px] leading-[18px] text-jeko-emerald">
                      Mot de passe oublié ?
                    </Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Se connecter"
                onPress={handleLogin}
                className="mt-1 h-[52px] flex-row items-center justify-center rounded-[14px] bg-jeko-emerald"
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
                <Text className="font-jeko-semibold text-[15px] leading-5 text-white">Se connecter</Text>
              </Pressable>
            </View>

            {/* Divider */}
            <View className="my-6 flex-row items-center gap-4">
              <View className="h-px flex-1 bg-[#DCE8E3]" />
              <Text className="font-jeko text-xs uppercase tracking-[1px] text-[#6E7A75]">ou</Text>
              <View className="h-px flex-1 bg-[#DCE8E3]" />
            </View>

            {/* Create account */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Créer un compte"
              onPress={() => router.push('/signup')}
              className="h-[52px] flex-row items-center justify-center rounded-[14px] border-[1.2px] border-jeko-emerald bg-white"
              style={({ pressed }) => pressed && { backgroundColor: '#F3FBF8' }}>
              <Text className="font-jeko-semibold text-[15px] leading-5 text-jeko-emerald">Créer un compte</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
