import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface TranslationHistoryItem {
    id: string;
    sourceText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    timestamp: number;
}

interface TranslationContextType {
    sourceLang: string;
    setSourceLang: (lang: string) => void;
    targetLang: string;
    setTargetLang: (lang: string) => void;
    history: TranslationHistoryItem[];
    addToHistory: (item: Omit<TranslationHistoryItem, 'id' | 'timestamp'>) => void;
    clearHistory: () => void;
    apiKey: string;
    setApiKey: (key: string) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sourceLang, setSourceLang] = useState('English');
    const [targetLang, setTargetLang] = useState('Spanish');
    const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        saveSettings();
    }, [history, apiKey]);

    const loadSettings = async () => {
        try {
            const storedHistory = await AsyncStorage.getItem('translation_history');
            const storedApiKey = await AsyncStorage.getItem('groq_api_key');

            if (storedHistory) setHistory(JSON.parse(storedHistory));
            if (storedApiKey) setApiKey(storedApiKey);
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    };

    const saveSettings = async () => {
        try {
            await AsyncStorage.setItem('translation_history', JSON.stringify(history));
            await AsyncStorage.setItem('groq_api_key', apiKey);
        } catch (error) {
            console.error('Failed to save settings', error);
        }
    };

    const addToHistory = (item: Omit<TranslationHistoryItem, 'id' | 'timestamp'>) => {
        const newItem: TranslationHistoryItem = {
            ...item,
            id: Date.now().toString(),
            timestamp: Date.now(),
        };
        setHistory(prev => [newItem, ...prev]);
    };

    const clearHistory = async () => {
        setHistory([]);
        await AsyncStorage.removeItem('translation_history');
    };

    return (
        <TranslationContext.Provider
            value={{
                sourceLang,
                setSourceLang,
                targetLang,
                setTargetLang,
                history,
                addToHistory,
                clearHistory,
                apiKey,
                setApiKey,
            }}
        >
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
};
