import axios from 'axios';
import * as FileSystem from 'expo-file-system/legacy';

const GROQ_API_URL = 'https://api.groq.com/openai/v1';
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '***************************************************';
// Models
const TRANSLATION_MODEL = 'openai/gpt-oss-120b';
const TRANSCRIPTION_MODEL = 'whisper-large-v3-turbo';

export interface TranslationResult {
    text: string;
}

export interface TranscriptionResult {
    text: string;
}

export const transcribeAudio = async (uri: string, apiKey: string): Promise<string> => {
    const keyToUse = apiKey || GROQ_API_KEY;
    if (!keyToUse || keyToUse === 'YOUR_GROQ_API_KEY_HERE') {
        throw new Error('Groq API Key is missing. Please set it in settings.');
    }

    try {
        const formData = new FormData();

        // Append the audio file
        // Note: React Native's FormData requires a specific object structure for files
        formData.append('file', {
            uri: uri,
            name: 'audio.m4a', // Ensure the extension matches the recording format
            type: 'audio/m4a',
        } as any);

        formData.append('model', TRANSCRIPTION_MODEL);
        formData.append('response_format', 'json');

        const response = await fetch(`${GROQ_API_URL}/audio/transcriptions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${keyToUse}`,
                // 'Content-Type': 'multipart/form-data', // Let fetch set this automatically with boundary
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Transcription failed');
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('Transcription Error:', error);
        throw error;
    }
};

export const translateText = async (
    text: string,
    sourceLang: string,
    targetLang: string,
    apiKey: string
): Promise<string> => {
    const keyToUse = apiKey || GROQ_API_KEY;
    if (!keyToUse || keyToUse === 'YOUR_GROQ_API_KEY_HERE') {
        throw new Error('Groq API Key is missing. Please set it in settings.');
    }

    try {
        const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Only provide the translated text, no explanations or other text.\n\nText: ${text}`;

        const response = await axios.post(
            `${GROQ_API_URL}/chat/completions`,
            {
                model: TRANSLATION_MODEL,
                messages: [
                    { role: 'system', content: 'You are a helpful translator.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3,
            },
            {
                headers: {
                    'Authorization': `Bearer ${keyToUse}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
        console.error('Translation Error:', error);
        throw error;
    }
};

export const generateSpeech = async (
    text: string,
    apiKey: string
): Promise<string> => {
    const keyToUse = apiKey || GROQ_API_KEY;
    if (!keyToUse || keyToUse === 'YOUR_GROQ_API_KEY_HERE') {
        throw new Error('Groq API Key is missing. Please set it in settings.');
    }

    try {
        const response = await fetch(`${GROQ_API_URL}/audio/speech`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${keyToUse}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'playai-tts',
                input: text,
                voice: 'Celeste-PlayAI', // Default voice
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Speech generation failed');
        }

        // Get the audio data as a blob
        const blob = await response.blob();

        // Convert blob to base64
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = async () => {
                const result = reader.result;
                if (typeof result !== 'string') {
                    reject(new Error('Failed to convert audio blob to base64'));
                    return;
                }

                const base64data = result.split(',')[1];
                const fileUri = `${FileSystem.documentDirectory}speech_${Date.now()}.mp3`;

                try {
                    await FileSystem.writeAsStringAsync(fileUri, base64data, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    resolve(fileUri);
                } catch (e) {
                    reject(e);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

    } catch (error) {
        console.error('Speech Generation Error:', error);
        throw error;
    }
};
