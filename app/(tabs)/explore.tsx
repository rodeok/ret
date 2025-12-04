import { Image } from 'expo-image';
import { Linking, StyleSheet } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { Fonts } from '@/constants/theme';

export default function PortfolioScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#0A0A0A', dark: '#000000' }}
      headerImage={
        <Image
          source={require('@/assets/images/matalabs-logo.png')} // Add your logo here!
          style={styles.headerImage}
          contentFit="contain"
        />
      }>
      {/* Hero Title */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
            fontSize: 42,
            fontWeight: '900',
            letterSpacing: -1,
          }}>
          MataLabs
        </ThemedText>
      </ThemedView>

      <ThemedText style={styles.subtitle}>
        Building the future with AI-powered mobile & web applications.
      </ThemedText>

      {/* About Section */}
      <Collapsible title="About MataLabs" defaultOpen>
        <ThemedText>
          We are a cutting-edge software studio specializing in{' '}
          <ThemedText type="defaultSemiBold">React Native</ThemedText>,{' '}
          <ThemedText type="defaultSemiBold">AI integration</ThemedText>, and{' '}
          <ThemedText type="defaultSemiBold">full-stack development</ThemedText>.
        </ThemedText>
        <ThemedText style={{ marginTop: 12 }}>
          From voice-powered AI translators to real-time data apps, we deliver fast, beautiful,
          and intelligent solutions that scale.
        </ThemedText>
      </Collapsible>

      {/* Expertise */}
      <Collapsible title="Our Expertise">
        <ThemedText>• Cross-platform apps (iOS, Android, Web)</ThemedText>
        <ThemedText>• AI & LLM integration (Groq, OpenAI, Llama)</ThemedText>
        <ThemedText>• Real-time voice transcription & translation</ThemedText>
        <ThemedText>• Modern UI/UX with animations & dark mode</ThemedText>
        <ThemedText>• Expo & React Native at production scale</ThemedText>
      </Collapsible>

      {/* Featured Project */}
      <Collapsible title="Featured Project: Voice Translator">
        <ThemedText>
          A real-time voice translation app powered by{' '}
          <ThemedText type="defaultSemiBold">Groq + Whisper</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">Llama 3.1</ThemedText>.
        </ThemedText>
        <ThemedText style={{ marginTop: 8 }}>
          Speak in any language → instantly hear and read the translation.
        </ThemedText>
        <Image
          source={require('@/assets/images/voice-translator-preview.png')} // Optional: add screenshot
          style={{ width: '100%', height: 200, borderRadius: 12, marginVertical: 16 }}
          placeholder="L6PZf7?uoJ-_@.bRayjZ~qQ;IAxZ"
        />
      </Collapsible>

      {/* GitHub & Contact */}
      <Collapsible title="Open Source & Contact">
        <ThemedText>
          We're strong believers in open collaboration and clean code.
        </ThemedText>
        <ExternalLink href="https://github.com/rodeok">
          <ThemedText type="link" style={styles.githubLink}>
            github.com/matalabs
          </ThemedText>
        </ExternalLink>
        <ThemedText style={{ marginTop: 12 }}>
          Want to work together? Reach out at{' '}
          <ThemedText
            type="link"
            onPress={() => Linking.openURL('mailto:hello@matalabs.dev')}>
            hello@matalabs.dev
          </ThemedText>
        </ThemedText>
      </Collapsible>

      {/* Final CTA */}
      <ThemedView style={styles.footer}>
        <ThemedText type="subtitle" style={{ textAlign: 'center', marginTop: 20 }}>
          Let's build something amazing together.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: 380,
    height: 380,
    opacity: 0.15,
    position: 'absolute',
    bottom: -80,
    left: -50,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  githubLink: {
    fontSize: 18,
    marginTop: 12,
  },
  footer: {
    marginTop: 30,
    paddingBottom: 40,
  },
});