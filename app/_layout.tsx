import {
  Stack,
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SettingsProvider } from '@/contexts/SettingsContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SettingsProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: true,
              title: 'Settings',
              headerBackTitle: 'Back',
            }}
          />
        </Stack>
        {/* Light status bar for the full-screen AR camera home; the Settings
            screen overrides this with style="auto". */}
        <StatusBar style="light" />
      </ThemeProvider>
    </SettingsProvider>
  );
}
