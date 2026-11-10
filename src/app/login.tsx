import { useAuth } from '@clerk/expo';
import { AuthView } from '@clerk/expo/native';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/role-selection');
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isSignedIn) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />
      <AuthView mode="signIn" isDismissible={false} />
    </View>
  );
}
