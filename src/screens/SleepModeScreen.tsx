import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Moon, Play, Pause, X, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const SLEEP_SOUNDS = [
    { id: 'rain', name: 'Soft Rain', icon: 'cloud-rain' },
    { id: 'ocean', name: 'Ocean Waves', icon: 'waves' },
    { id: 'forest', name: 'Deep Forest', icon: 'tree' },
    { id: '432hz', name: '432Hz Healing', icon: 'music' },
];

export const SleepModeScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const [selectedSound, setSelectedSound] = useState('rain');
    const [isTimerActive, setIsTimerActive] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#0B0F11', '#1A1D1E']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <Typography variant="headlineSm" color="#FFFFFF">Sleep Mode</Typography>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <X color="#FFFFFF" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.mainIcon}>
                    <Moon size={80} color={theme.primary} fill={theme.primary} />
                </View>

                <Typography variant="displaySm" color="#FFFFFF" style={styles.title}>
                    Good Night
                </Typography>
                <Typography variant="bodyMd" color="rgba(255,255,255,0.6)" style={styles.subtitle}>
                    Choose your sanctuary for deep rest.
                </Typography>

                <View style={styles.soundsGrid}>
                    {SLEEP_SOUNDS.map((sound) => (
                        <Card
                            key={sound.id}
                            style={[
                                styles.soundCard,
                                selectedSound === sound.id && { backgroundColor: 'rgba(73, 88, 172, 0.3)', borderColor: theme.primary, borderWidth: 1 }
                            ]}
                            onPress={() => setSelectedSound(sound.id)}
                        >
                            <Typography variant="labelLg" color="#FFFFFF">{sound.name}</Typography>
                            {selectedSound === sound.id && <Play size={20} color={theme.primary} fill={theme.primary} />}
                        </Card>
                    ))}
                </View>

                <View style={styles.timerSection}>
                    <Card style={styles.timerCard}>
                        <View style={styles.timerRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Clock size={20} color="#FFFFFF" />
                                <Typography variant="bodyMd" color="#FFFFFF" style={{ marginLeft: 12 }}>Sleep Timer</Typography>
                            </View>
                            <Typography variant="labelLg" color={theme.primary}>30 min</Typography>
                        </View>
                    </Card>
                </View>

                <Button
                    title={isTimerActive ? "Stop Sanctuary" : "Start Sanctuary"}
                    onPress={() => setIsTimerActive(!isTimerActive)}
                    style={styles.startButton}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: tokens.spacing.lg
    },
    closeButton: { padding: 8 },
    content: { padding: tokens.spacing.xl, alignItems: 'center' },
    mainIcon: { marginTop: tokens.spacing.xxl, marginBottom: tokens.spacing.xl },
    title: { marginBottom: tokens.spacing.xs },
    subtitle: { marginBottom: tokens.spacing.xxl, textAlign: 'center' },
    soundsGrid: { width: '100%', marginBottom: tokens.spacing.xxl },
    soundCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: tokens.spacing.sm,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: tokens.spacing.lg,
    },
    timerSection: { width: '100%', marginBottom: tokens.spacing.xl },
    timerCard: { backgroundColor: 'rgba(255,255,255,0.05)' },
    timerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    startButton: { width: '100%', marginTop: tokens.spacing.md },
});
