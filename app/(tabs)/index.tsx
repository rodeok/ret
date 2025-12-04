import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../context/TranslationContext';
import { generateSpeech, transcribeAudio, translateText } from '../../services/groq';

export default function TranslatorScreen() {
  const router = useRouter();
  const {
    sourceLang,
    targetLang,
    setSourceLang,
    setTargetLang,
    addToHistory,
    apiKey
  } = useTranslation();

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission needed', 'Microphone permission is required to record audio.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setSourceText('');
      setTranslatedText('');
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    setIsProcessing(true);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        processAudio(uri);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
      setIsProcessing(false);
    }
  };

  const processAudio = async (uri: string) => {
    try {
      // 1. Transcribe
      const transcription = await transcribeAudio(uri, apiKey);
      setSourceText(transcription);

      if (!transcription.trim()) {
        setIsProcessing(false);
        return;
      }

      // 2. Translate
      const translation = await translateText(transcription, sourceLang, targetLang, apiKey);
      setTranslatedText(translation);

      // 3. Save to History
      addToHistory({
        sourceText: transcription,
        translatedText: translation,
        sourceLang,
        targetLang,
      });

    } catch (error: any) {
      console.error('Processing error:', error);
      Alert.alert('Error', error.message || 'Failed to process audio.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlay = async (text: string) => {
    if (!text || !text.trim()) return;

    try {
      const uri = await generateSpeech(text, apiKey);
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
    } catch (e) {
      console.error('Playback error:', e);
      Alert.alert('Error', 'Unable to play audio.');
    }
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };


  return (
    <View style={styles.container}>
      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={styles.langButton}
          onPress={() => router.push({ pathname: '/language-select', params: { type: 'source' } })}
        >
          <Text style={styles.langText}>{sourceLang}</Text>
          <Ionicons name="chevron-down" size={16} color="#3b5998" />
        </TouchableOpacity>

        <TouchableOpacity onPress={swapLanguages} style={styles.swapButton}>
          <Ionicons name="swap-horizontal" size={24} color="#8e8e93" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.langButton}
          onPress={() => router.push({ pathname: '/language-select', params: { type: 'target' } })}
        >
          <Text style={styles.langText}>{targetLang}</Text>
          <Ionicons name="chevron-down" size={16} color="#3b5998" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultContainer} contentContainerStyle={styles.resultContent}>
        {sourceText ? (
          <View style={styles.card}>
            <Text style={styles.label}>{sourceLang}</Text>
            <Text style={styles.text}>{sourceText}</Text>
            <TouchableOpacity style={styles.playButton} onPress={() => handlePlay(sourceText)} disabled={isProcessing}>
              <Ionicons name="play-circle" size={24} color="#3b5998" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Tap the microphone to start speaking</Text>
          </View>
        )}

        {isProcessing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b5998" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}

        {translatedText ? (
          <View style={[styles.card, styles.translatedCard]}>
            <Text style={styles.label}>{targetLang}</Text>
            <Text style={[styles.text, styles.translatedText]}>{translatedText}</Text>
            {/* Play button */}
            <TouchableOpacity style={styles.playButton} onPress={() => handlePlay(translatedText)} disabled={isProcessing}>
              <Ionicons name="play-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordingButton]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
        >
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={32}
            color="#fff"
          />
        </TouchableOpacity>
        <Text style={styles.statusText}>
          {isRecording ? 'Listening...' : 'Tap to Speak'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f4ff',
  },
  langText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b5998',
    marginRight: 4,
  },
  swapButton: {
    padding: 8,
  },
  resultContainer: {
    flex: 1,
  },
  resultContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  translatedCard: {
    backgroundColor: '#3b5998',
  },
  label: {
    fontSize: 12,
    color: '#8e8e93',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  text: {
    fontSize: 20,
    color: '#333',
    lineHeight: 28,
  },
  translatedText: {
    color: '#fff',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  placeholderText: {
    color: '#8e8e93',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#8e8e93',
  },
  controls: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  playButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#3b5998',
    padding: 10,
    borderRadius: 8,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b5998',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b5998',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  recordingButton: {
    backgroundColor: '#ff3b30',
    shadowColor: '#ff3b30',
  },
  statusText: {
    fontSize: 16,
    color: '#8e8e93',
    fontWeight: '500',
  },
});
