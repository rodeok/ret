import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TranslationProvider } from '../context/TranslationContext';

export default function RootLayout() {
  return (
    <TranslationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="language-select" options={{ presentation: 'modal', title: 'Select Language', headerShown: true }} />
      </Stack>
      <StatusBar style="auto" />
    </TranslationProvider>
  );
}
