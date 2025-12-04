import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../context/TranslationContext';

const LANGUAGES = [
    'English', 'Spanish', 'French', 'German', 'Italian',
    'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Russian',
    'Arabic', 'Hindi', 'Turkish', 'Dutch', 'Polish', 'igbo', 'yoruba', 'hausa', 'tiv', 'igala'
];

export default function LanguageSelectScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { setSourceLang, setTargetLang } = useTranslation();
    const [search, setSearch] = useState('');

    const isSource = params.type === 'source';

    const filteredLanguages = LANGUAGES.filter(lang =>
        lang.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (lang: string) => {
        if (isSource) {
            setSourceLang(lang);
        } else {
            setTargetLang(lang);
        }
        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search language"
                    value={search}
                    onChangeText={setSearch}
                    autoFocus
                />
            </View>

            <FlatList
                data={filteredLanguages}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => handleSelect(item)}
                    >
                        <Text style={styles.itemText}>{item}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f7',
        margin: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    itemText: {
        fontSize: 17,
        color: '#000',
    },
    separator: {
        height: 1,
        backgroundColor: '#c6c6c8',
        marginLeft: 20,
    },
});
