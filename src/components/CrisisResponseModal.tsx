import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Linking, SafeAreaView } from 'react-native';
import { Phone, X, ShieldAlert } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';

export interface Helpline {
    name: string;
    phone: string;
    desc: string;
}

interface Props {
    visible: boolean;
    onClose: () => void;
    helplines: Helpline[];
    riskLevel: 'HIGH' | 'CRITICAL';
}

export const CrisisResponseModal = ({ visible, onClose, helplines, riskLevel }: Props) => {
    const { theme } = useTheme();

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <X color={theme.text} strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <ShieldAlert size={80} color="#EF4444" />
                    </View>

                    <Text style={[styles.title, { color: theme.text }]}>You are not alone</Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        It sounds like you\u0027re going through a really tough time. We\u0027re here for you,
                        and there are people who can help right now.
                    </Text>

                    <View style={styles.helplineSection}>
                        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                            Immediate Help Resources
                        </Text>
                        {helplines.map((hl, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.helplineCard}
                                onPress={() => handleCall(hl.phone)}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.hlName}>{hl.name}</Text>
                                    <Text style={styles.hlPhone}>{hl.phone}</Text>
                                </View>
                                <View style={styles.callCircle}>
                                    <Phone size={20} color="#FFF" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </div>

                    <TouchableOpacity
                        style={[styles.sosButton, { backgroundColor: '#EF4444' }]}
                        onPress={() => handleCall('112')}
                    >
                        <Text style={styles.sosText}>TRIGGER SOS (112)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.chatSupportBtn} onPress={onClose}>
                        <Text style={[styles.chatSupportText, { color: theme.primary }]}>
                            Continue talking to AI Support
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20, alignItems: 'flex-end' },
    closeBtn: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
    content: { flex: 1, padding: 24, alignItems: 'center' },
    iconContainer: { marginBottom: 24 },
    title: { fontSize: 32, fontWeight: '800', marginBottom: 16, textAlign: 'center', letterSpacing: -0.5 },
    subtitle: { fontSize: 17, textAlign: 'center', lineHeight: 26, marginBottom: 40, paddingHorizontal: 10 },
    helplineSection: { width: '100%', marginBottom: 32 },
    sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' },
    helplineCard: {
        backgroundColor: '#F9FAFB',
        padding: 20,
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6'
    },
    hlName: { fontSize: 18, fontWeight: '700', color: '#111827' },
    hlPhone: { fontSize: 15, color: '#6B7280', marginTop: 4 },
    callCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sosButton: {
        width: '100%',
        paddingVertical: 20,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5
    },
    sosText: { color: '#FFF', fontSize: 18, fontWeight: '800', letterSpacing: 1 },
    chatSupportBtn: { paddingVertical: 15 },
    chatSupportText: { fontSize: 16, fontWeight: '600' }
});
