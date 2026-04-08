import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Moon, Play, Pause, X, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { audioService } from '../services/AudioService';

const SLEEP_SOUNDS = [
    { id: 'rain', name: 'Soft Rain', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Placeholder
    { id: 'ocean', name: 'Ocean Waves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 'forest', name: 'Deep Forest', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { id: '432hz', name: '432Hz Healing', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
];

export const SleepModeScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const [selectedSound, setSelectedSound] = useState(SLEEP_SOUNDS[0]);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isTimerActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleStop();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerActive, timeLeft]);

    const handleStart = async () => {
        setIsTimerActive(true);
        try {
            await audioService.load(selectedSound.url, (status) => {
                if (status.didJustFinish) {
                    audioService.play(); // Loop
                }
            });
            await audioService.play();
        } catch (error) {
            console.error('Failed to play sleep sound:', error);
        }
    };

    const handleStop = async () => {
        setIsTimerActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
        await audioService.stop();
        await audioService.unload();
        setTimeLeft(30 * 60); // Reset
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

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
                                selectedSound.id === sound.id && { backgroundColor: 'rgba(73, 88, 172, 0.3)', borderColor: theme.primary, borderWidth: 1 }
                            ]}
                            onPress={() => setSelectedSound(sound)}
                        >
                            <Typography variant="labelLg" color="#FFFFFF">{sound.name}</Typography>
                            {selectedSound.id === sound.id && <Play size={20} color={theme.primary} fill={theme.primary} />}
                        </Card>
                    ))}
                </View>

                <View style={styles.timerSection}>
                    <Card style={styles.timerCard}>
                        <View style={styles.timerRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Clock size={20} color="#FFFFFF" />
                                <Typography variant="bodyMd" color="#FFFFFF" style={{ marginLeft: 12 }}>Time Remaining</Typography>
                            </View>
                            <Typography variant="labelLg" color={theme.primary}>{formatTime(timeLeft)}</Typography>
                        </View>
                    </Card>
                </View>

                <Button
                    title={isTimerActive ? "Stop Sanctuary" : "Start Sanctuary"}
                    onPress={isTimerActive ? handleStop : handleStart}
                    style={styles.startButton}
                    variant={isTimerActive ? "secondary" : "primary"}
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
village
