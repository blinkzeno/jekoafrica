import { router, Stack } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Alert,
  type KeyboardTypeOptions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Polygon, Rect } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

import { JekoColors } from '@/constants/jeko';

const TEXT = '#0F1E1B';
const TEXT_MUTED = '#5A6B66';
const BORDER = '#DCE8E3';
const ERROR = '#BA1A1A';
const MAX_CONTENT_WIDTH = 480;

/* ---------- Icons (react-native-svg, like the welcome screen) ---------- */

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

function ArrowRightIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

function CheckIcon({ color = '#FFFFFF', size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BigCheckIcon() {
  return (
    <Svg width={38} height={38} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke={JekoColors.emerald}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TogoFlag() {
  return (
    <View className="overflow-hidden rounded-[3px]">
      <Svg width={26} height={17} viewBox="0 0 500 300">
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

/* ---------- Floating-label outlined input (14px radius) ---------- */

type FloatingInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'words' | 'sentences';
  autoComplete?: 'name' | 'tel' | 'password' | 'off';
  textContentType?: 'name' | 'telephoneNumber' | 'password' | 'none';
  secureTextEntry?: boolean;
  placeholder?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  maxLength?: number;
  returnKeyType?: 'next' | 'done';
  onSubmitEditing?: () => void;
  testID?: string;
};

function FloatingInput({
  label,
  value,
  onChangeText,
  error,
  keyboardType,
  autoCapitalize = 'sentences',
  autoComplete = 'off',
  textContentType = 'none',
  secureTextEntry,
  placeholder,
  leftAdornment,
  rightAdornment,
  maxLength,
  returnKeyType = 'next',
  onSubmitEditing,
  testID,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [anim] = useState(() => new Animated.Value(value.length > 0 ? 1 : 0));
  const floated = focused || value.length > 0;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: floated ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [anim, floated]);

  const labelStyle = {
    top: anim.interpolate({ inputRange: [0, 1], outputRange: [16, -9] }),
    fontSize: anim.interpolate({ inputRange: [0, 1], outputRange: [15.5, 12] }),
    color: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [TEXT_MUTED, focused ? JekoColors.emerald : TEXT_MUTED],
    }),
  };

  const borderColor = error ? ERROR : focused ? JekoColors.emerald : BORDER;

  return (
    <View className="gap-[5px]">
      <View
        className="h-14 flex-row items-center rounded-[14px] bg-white px-[14px]"
        style={{ borderColor, borderWidth: focused || error ? 1.6 : 1.2 }}>
        <Animated.Text
          pointerEvents="none"
          numberOfLines={1}
          className="absolute left-[11px] z-[1] bg-white px-1 font-jeko"
          style={labelStyle}>
          {label}
        </Animated.Text>

        {leftAdornment ? (
          <View className="h-full flex-row items-center border-r border-[#DCE8E3] pr-3">{leftAdornment}</View>
        ) : null}

        <TextInput
          className="h-full flex-1 px-0 font-jeko text-base text-[#0F1E1B]"
          style={leftAdornment ? { paddingLeft: 12 } : null}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          secureTextEntry={secureTextEntry}
          placeholder={floated ? placeholder : undefined}
          placeholderTextColor="#9AABA5"
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          selectionColor={JekoColors.emerald}
          testID={testID}
        />

        {rightAdornment ? <View className="h-full flex-row items-center">{rightAdornment}</View> : null}
      </View>

      {error ? (
        <Text className="pl-1 font-jeko text-xs leading-4 text-[#BA1A1A]" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

/* ---------- Helpers ---------- */

function formatTogoPhone(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

/* ---------- Screen ---------- */

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; password?: string; terms?: string }>({});
  const [created, setCreated] = useState(false);

  const phoneDigits = useMemo(() => phone.replace(/\D/g, ''), [phone]);

  const handleSubmit = () => {
    const next: typeof errors = {};
    if (fullName.trim().length < 3) next.name = 'Entrez votre nom complet';
    if (phoneDigits.length !== 8) next.phone = 'Entrez les 8 chiffres de votre numéro';
    if (password.length < 8) next.password = 'Au moins 8 caractères';
    if (!termsAccepted) next.terms = 'Vous devez accepter les conditions';
    setErrors(next);
    if (Object.keys(next).length === 0) setCreated(true);
  };

  if (created) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-white px-8">
        <StatusBar style="dark" />
        <Stack.Screen options={{ title: 'Compte créé' }} />
        <View className="mb-1 h-[76px] w-[76px] items-center justify-center rounded-[38px] bg-[#E4F7EF]">
          <BigCheckIcon />
        </View>
        <Text className="text-center font-jeko-bold text-2xl leading-[30px] text-[#0F1E1B]">
          Bienvenue, {fullName.trim().split(' ')[0]} !
        </Text>
        <Text className="mb-3 text-center font-jeko text-[15px] leading-[22px] text-[#5A6B66]">
          Votre compte Jeko est prêt. Vous pouvez maintenant commander votre première course.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continuer"
          onPress={() => router.push('/role-selection')}
          className="mt-1.5 h-[52px] w-full flex-row items-center justify-center gap-2 rounded-[14px] bg-jeko-emerald"
          style={({ pressed }) => [
            {
              shadowColor: JekoColors.emerald,
              shadowOpacity: 0.28,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 3,
            },
            pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
          ]}>
          <Text className="font-jeko-semibold text-[15.5px] leading-5 text-white">Continuer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: 'Créer un compte' }} />

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 8,
            paddingBottom: Math.max(insets.bottom, 16) + 16,
          }}
          keyboardShouldPersistTaps="handled">
          <View className="w-full self-center px-5" style={{ maxWidth: MAX_CONTENT_WIDTH }}>
            {/* Top bar : back arrow */}
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

            {/* Title */}
            <Text className="mt-1 font-jeko-bold text-[27px] leading-[34px] tracking-[-0.4px] text-[#0F1E1B]">
              Créer un compte
            </Text>
            <Text className="mt-1.5 font-jeko text-[15px] leading-[22px] text-[#5A6B66]">
              Quelques informations pour commencer
            </Text>

            {/* Form */}
            <View className="mt-[26px] gap-4">
              <FloatingInput
                label="Nom complet"
                value={fullName}
                onChangeText={(t) => {
                  setFullName(t);
                  if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
                }}
                error={errors.name}
                placeholder="Ex : Kossi Mensah"
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                testID="signup-fullname"
              />

              <FloatingInput
                label="Téléphone"
                value={phone}
                onChangeText={(t) => {
                  setPhone(formatTogoPhone(t));
                  if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
                }}
                error={errors.phone}
                placeholder="90 12 34 56"
                keyboardType="number-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                maxLength={11}
                leftAdornment={
                  <View className="flex-row items-center gap-2">
                    <TogoFlag />
                    <Text className="font-jeko-semibold text-[15px] text-[#0F1E1B]">+228</Text>
                  </View>
                }
                returnKeyType="next"
                testID="signup-phone"
              />

              <FloatingInput
                label="Mot de passe"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                }}
                error={errors.password}
                placeholder="Au moins 8 caractères"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                rightAdornment={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    hitSlop={8}
                    onPress={() => setShowPassword((v) => !v)}
                    className="h-10 w-10 items-center justify-center">
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </Pressable>
                }
                testID="signup-password"
              />

              {/* Terms */}
              <View className="mt-0.5 gap-1.5">
                <View className="flex-row items-start gap-3">
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: termsAccepted }}
                    accessibilityLabel="J'accepte les conditions d'utilisation et la politique de confidentialité"
                    onPress={() => {
                      setTermsAccepted((v) => !v);
                      if (errors.terms) setErrors((e) => ({ ...e, terms: undefined }));
                    }}
                    className={`mt-px h-[22px] w-[22px] items-center justify-center rounded-md border-[1.6px] ${
                      termsAccepted ? 'border-jeko-emerald bg-jeko-emerald' : 'border-[#B9CDC6] bg-white'
                    }`}>
                    {termsAccepted ? <CheckIcon size={15} /> : null}
                  </Pressable>
                  <Text className="flex-1 font-jeko text-[13px] leading-[19px] text-[#0F1E1B]">
                    J&apos;accepte les{' '}
                    <Text
                      accessibilityRole="link"
                      className="font-jeko-semibold text-jeko-emerald"
                      onPress={() =>
                        Alert.alert(
                          "Conditions d'utilisation",
                          'Le document sera publié avant le lancement de Jeko.'
                        )
                      }>
                      conditions d&apos;utilisation
                    </Text>{' '}
                    et la{' '}
                    <Text
                      accessibilityRole="link"
                      className="font-jeko-semibold text-jeko-emerald"
                      onPress={() =>
                        Alert.alert(
                          'Politique de confidentialité',
                          'Le document sera publié avant le lancement de Jeko.'
                        )
                      }>
                      politique de confidentialité
                    </Text>
                  </Text>
                </View>
                {errors.terms ? <Text className="pl-1 font-jeko text-xs leading-4 text-[#BA1A1A]">{errors.terms}</Text> : null}
              </View>

              {/* Primary action */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Continuer"
                onPress={handleSubmit}
                className="mt-1.5 h-[52px] flex-row items-center justify-center gap-2 rounded-[14px] bg-jeko-emerald"
                style={({ pressed }) => [
                  {
                    shadowColor: JekoColors.emerald,
                    shadowOpacity: 0.28,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 3,
                  },
                  pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
                ]}>
                <Text className="font-jeko-semibold text-[15.5px] leading-5 text-white">Continuer</Text>
                <ArrowRightIcon />
              </Pressable>
            </View>

            {/* Footer link */}
            <View className="mt-[22px] flex-row items-center justify-center">
              <Text className="font-jeko text-sm text-[#5A6B66]">Déjà un compte ? </Text>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Se connecter"
                hitSlop={8}
                onPress={() => router.push('/login')}>
                <Text className="font-jeko-semibold text-sm text-jeko-emerald">Se connecter</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
