import { router, Stack } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  type KeyboardTypeOptions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Polygon, Rect } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

import { JekoColors, JekoFonts, JekoRadius } from '@/constants/jeko';

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
    <View style={styles.flagWrap}>
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
    <View style={styles.fieldWrap}>
      <View
        style={[
          styles.field,
          { borderColor, borderWidth: focused || error ? 1.6 : 1.2 },
        ]}>
        <Animated.Text
          pointerEvents="none"
          numberOfLines={1}
          style={[styles.floatingLabel, labelStyle]}>
          {label}
        </Animated.Text>

        {leftAdornment ? <View style={styles.leftAdornment}>{leftAdornment}</View> : null}

        <TextInput
          style={[styles.input, leftAdornment ? styles.inputWithLeft : null]}
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

        {rightAdornment ? <View style={styles.rightAdornment}>{rightAdornment}</View> : null}
      </View>

      {error ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
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
      <View style={[styles.safe, styles.successContainer]}>
        <StatusBar style="dark" />
        <Stack.Screen options={{ title: 'Compte créé' }} />
        <View style={styles.successIcon}>
          <BigCheckIcon />
        </View>
        <Text style={styles.successTitle}>Bienvenue, {fullName.trim().split(' ')[0]} !</Text>
        <Text style={styles.successSubtitle}>
          Votre compte Jeko est prêt. Vous pouvez maintenant commander votre première course.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour à l'accueil"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}>
          <Text style={styles.primaryButtonLabel}>Retour à l&apos;accueil</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: 'Créer un compte' }} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 16) + 16 },
          ]}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            {/* Top bar : back arrow */}
            <View style={styles.topBar}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Retour"
                hitSlop={8}
                onPress={() => router.back()}
                style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
                <BackIcon />
              </Pressable>
            </View>

            {/* Title */}
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Quelques informations pour commencer</Text>

            {/* Form */}
            <View style={styles.form}>
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
                  <View style={styles.phonePrefix}>
                    <TogoFlag />
                    <Text style={styles.phonePrefixText}>+228</Text>
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
                    style={styles.eyeButton}>
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </Pressable>
                }
                testID="signup-password"
              />

              {/* Terms */}
              <View style={styles.termsBlock}>
                <View style={styles.termsRow}>
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: termsAccepted }}
                    accessibilityLabel="J'accepte les conditions d'utilisation et la politique de confidentialité"
                    onPress={() => {
                      setTermsAccepted((v) => !v);
                      if (errors.terms) setErrors((e) => ({ ...e, terms: undefined }));
                    }}
                    style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                    {termsAccepted ? <CheckIcon size={15} /> : null}
                  </Pressable>
                  <Text style={styles.termsText}>
                    J&apos;accepte les{' '}
                    <Text
                      accessibilityRole="link"
                      style={styles.termsLink}
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
                      style={styles.termsLink}
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
                {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}
              </View>

              {/* Primary action */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Continuer"
                onPress={handleSubmit}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}>
                <Text style={styles.primaryButtonLabel}>Continuer</Text>
                <ArrowRightIcon />
              </Pressable>
            </View>

            {/* Footer link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Déjà un compte ? </Text>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Se connecter"
                hitSlop={8}
                onPress={() =>
                  Alert.alert('Connexion', "L'écran de connexion arrive bientôt.")
                }>
                <Text style={styles.footerLink}>Se connecter</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },

  /* Top bar */
  topBar: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButton: {
    width: 44,
    height: 44,
    marginLeft: -10,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    backgroundColor: '#EEF6F2',
  },

  /* Title */
  title: {
    fontFamily: JekoFonts.bold,
    fontSize: 27,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: TEXT,
    marginTop: 4,
  },
  subtitle: {
    fontFamily: JekoFonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: TEXT_MUTED,
    marginTop: 6,
  },

  /* Form */
  form: {
    marginTop: 26,
    gap: 16,
  },
  fieldWrap: {
    gap: 5,
  },
  field: {
    height: 56,
    borderRadius: JekoRadius.button,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  floatingLabel: {
    position: 'absolute',
    left: 11,
    paddingHorizontal: 4,
    backgroundColor: '#FFFFFF',
    fontFamily: JekoFonts.regular,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: JekoFonts.regular,
    fontSize: 16,
    color: TEXT,
    paddingHorizontal: 0,
  },
  inputWithLeft: {
    paddingLeft: 12,
  },
  leftAdornment: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: BORDER,
    paddingRight: 12,
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phonePrefixText: {
    fontFamily: JekoFonts.semibold,
    fontSize: 15,
    color: TEXT,
  },
  rightAdornment: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagWrap: {
    borderRadius: 3,
    overflow: 'hidden',
  },
  errorText: {
    fontFamily: JekoFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: ERROR,
    paddingLeft: 4,
  },

  /* Terms */
  termsBlock: {
    gap: 6,
    marginTop: 2,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.6,
    borderColor: '#B9CDC6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: JekoColors.emerald,
    borderColor: JekoColors.emerald,
  },
  termsText: {
    flex: 1,
    fontFamily: JekoFonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: TEXT,
  },
  termsLink: {
    fontFamily: JekoFonts.semibold,
    color: JekoColors.emerald,
  },

  /* Primary button */
  primaryButton: {
    height: 52,
    borderRadius: JekoRadius.button,
    backgroundColor: JekoColors.emerald,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    shadowColor: JekoColors.emerald,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  primaryButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonLabel: {
    fontFamily: JekoFonts.semibold,
    fontSize: 15.5,
    lineHeight: 20,
    color: '#FFFFFF',
  },

  /* Footer */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  footerText: {
    fontFamily: JekoFonts.regular,
    fontSize: 14,
    color: TEXT_MUTED,
  },
  footerLink: {
    fontFamily: JekoFonts.semibold,
    fontSize: 14,
    color: JekoColors.emerald,
  },

  /* Success state */
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E4F7EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  successTitle: {
    fontFamily: JekoFonts.bold,
    fontSize: 24,
    lineHeight: 30,
    color: TEXT,
    textAlign: 'center',
  },
  successSubtitle: {
    fontFamily: JekoFonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 12,
  },
});
