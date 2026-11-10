import { useAuth, useClerk, useUser } from '@clerk/expo';
import { Stack, router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7FBF9] px-6">
        <StatusBar style="dark" />
        <Text className="font-jeko text-sm text-[#5A6B66]">Chargement…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F7FBF9] px-6 pt-16">
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: 'Profil' }} />
      <Text className="font-jeko-bold text-2xl text-[#0F1E1B]">Profil</Text>

      {isSignedIn ? (
        <View className="mt-6 gap-4">
          <View className="rounded-2xl border border-[#DCE8E3] bg-white p-4">
            <Text className="font-jeko-semibold text-base text-[#0F1E1B]">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress || user?.primaryPhoneNumber?.phoneNumber || 'Utilisateur'}
            </Text>
            {user?.primaryEmailAddress?.emailAddress ? (
              <Text className="mt-1 font-jeko text-sm text-[#5A6B66]">{user.primaryEmailAddress.emailAddress}</Text>
            ) : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Se déconnecter"
            onPress={() => signOut(() => router.replace('/login'))}
            className="h-[52px] items-center justify-center rounded-[14px] border border-[#DCE8E3] bg-white"
            style={({ pressed }) => pressed && { opacity: 0.85 }}>
            <Text className="font-jeko-semibold text-[15px] text-[#BA1A1A]">Se déconnecter</Text>
          </Pressable>
        </View>
      ) : (
        <View className="mt-6 gap-3">
          <Text className="font-jeko text-sm text-[#5A6B66]">Connectez-vous pour accéder à votre compte.</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/login')}
            className="h-[52px] items-center justify-center rounded-[14px] bg-jeko-emerald">
            <Text className="font-jeko-semibold text-[15px] text-white">Se connecter</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/signup')}
            className="h-[52px] items-center justify-center rounded-[14px] border border-jeko-emerald bg-white">
            <Text className="font-jeko-semibold text-[15px] text-jeko-emerald">Créer un compte</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
