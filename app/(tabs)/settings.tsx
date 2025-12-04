import { Ionicons } from '@expo/vector-icons';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://groq.com')}>
                        <Text style={styles.rowText}>Visit Groq Website</Text>
                        <Ionicons name="open-outline" size={20} color="#8e8e93" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Version</Text>
                        <Text style={styles.versionText}>1.0.0</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8e8e93',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    rowText: {
        fontSize: 16,
        color: '#333',
    },
    versionText: {
        fontSize: 16,
        color: '#8e8e93',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 12,
    },
});
