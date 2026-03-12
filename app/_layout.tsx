import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SettingsProvider } from '@/contexts/SettingsContext';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
      </Stack>
      <StatusBar style="light" />
    </SettingsProvider>
  );
}
