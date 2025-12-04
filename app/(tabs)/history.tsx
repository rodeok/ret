import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TranslationHistoryItem, useTranslation } from '../../context/TranslationContext';
import { generateSpeech } from '../../services/groq';

export default function HistoryScreen() {
    const { history, clearHistory, apiKey } = useTranslation();
    const [playingId, setPlayingId] = useState<string | null>(null);

    const handlePlay = async (text: string, id: string) => {
        if (playingId) return; // Prevent multiple playbacks

        try {
            setPlayingId(id);
            const uri = await generateSpeech(text, apiKey);
            const { sound } = await Audio.Sound.createAsync({ uri });
            await sound.playAsync();

            // Reset playing state when audio finishes (approximate, or use status update)
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setPlayingId(null);
                }
            });
        } catch (e) {
            console.error('Playback error:', e);
            Alert.alert('Error', 'Unable to play audio.');
            setPlayingId(null);
        }
    };

    const renderItem = ({ item }: { item: TranslationHistoryItem }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.langBadge}>
                    <Text style={styles.langText}>{item.sourceLang} → {item.targetLang}</Text>
                </View>
                <Text style={styles.date}>
                    {new Date(item.timestamp).toLocaleDateString()}
                </Text>
            </View>

            <Text style={styles.sourceText}>{item.sourceText}</Text>
            <View style={styles.divider} />

            <View style={styles.translationContainer}>
                <Text style={styles.translatedText}>{item.translatedText}</Text>
                <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => handlePlay(item.translatedText, item.id)}
                    disabled={playingId !== null}
                >
                    {playingId === item.id ? (
                        <ActivityIndicator size="small" color="#3b5998" />
                    ) : (
                        <Ionicons name="play-circle" size={28} color="#3b5998" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Recent Translations</Text>
                {history.length > 0 && (
                    <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="time-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No history yet</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    clearButton: {
        padding: 8,
    },
    clearText: {
        color: '#ff3b30',
        fontSize: 16,
    },
    listContent: {
        padding: 16,
        paddingTop: 0,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    langBadge: {
        backgroundColor: '#f0f4ff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    langText: {
        fontSize: 12,
        color: '#3b5998',
        fontWeight: '600',
    },
    date: {
        fontSize: 12,
        color: '#8e8e93',
    },
    sourceText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 8,
    },
    translationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    translatedText: {
        fontSize: 16,
        color: '#3b5998',
        fontWeight: '500',
        flex: 1,
        marginRight: 8,
    },
    playButton: {
        padding: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#8e8e93',
    },
});
