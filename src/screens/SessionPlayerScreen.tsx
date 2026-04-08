import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, X, Volume2, Moon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Typography } from '../components/Typography';
import { audioService } from '../services/AudioService';

const { width } = Dimensions.get('window');

const SAMPLE_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export const SessionPlayerScreen = ({ navigation, route }: any) => {
    const { theme } = useTheme();
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const initAudio = async () => {
            await audioService.load(SAMPLE_AUDIO_URL, (status) => {
                if (status.isLoaded) {
                    setPosition(status.positionMillis);
                    setDuration(status.durationMillis || 0);
                    setIsPlaying(status.isPlaying);
                }
            });
        };

        initAudio();

        return () => {
            audioService.unload();
        };
    }, []);

    const togglePlayback = async () => {
        if (isPlaying) {
            await audioService.pause();
        } else {
            await audioService.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (millis: number) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
    };

    const progress = duration > 0 ? position / duration : 0;

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[theme.primary, theme.surface]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <X color={theme.onSurface} size={28} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.artPlaceholder}>
                    <LinearGradient
                        colors={[theme.primaryContainer, theme.secondaryContainer]}
                        style={styles.artGradient}
                    />
                </View>

                <View style={styles.info}>
                    <Typography variant="displaySm" color={theme.onSurface} style={styles.title}>
                        Morning Resilience
                    </Typography>
                    <Typography variant="bodyLg" color={theme.onSurfaceVariant}>
                        Guided Meditation • 10 min
                    </Typography>
                </View>

                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: theme.surfaceContainerHigh }]}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${progress * 100}%`,
                                    backgroundColor: theme.primary
                                }
                            ]}
                        />
                    </View>
                    <View style={styles.timeContainer}>
                        <Typography variant="labelSm" color={theme.onSurfaceVariant}>
                            {formatTime(position)}
                        </Typography>
                        <Typography variant="labelSm" color={theme.onSurfaceVariant}>
                            {formatTime(duration)}
                        </Typography>
                    </View>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => audioService.seekRelative(-15000)}
                    >
                        <SkipBack size={32} color={theme.onSurface} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.playButton, { backgroundColor: theme.primary }]}
                        onPress={togglePlayback}
                    >
                        {isPlaying ? (
                            <Pause size={32} color={theme.onPrimary} />
                        ) : (
                            <Play size={32} color={theme.onPrimary} fill={theme.onPrimary} />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => audioService.seekRelative(15000)}
                    >
                        <SkipForward size={32} color={theme.onSurface} />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerAction}>
                        <Volume2 color={theme.onSurfaceVariant} size={24} />
                        <Typography variant="labelMd" color={theme.onSurfaceVariant} style={styles.footerLabel}>
                            Volume
                        </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.footerAction}
                        onPress={() => navigation.navigate('SleepMode')}
                    >
                        <Moon color={theme.onSurfaceVariant} size={24} />
                        <Typography variant="labelMd" color={theme.onSurfaceVariant} style={styles.footerLabel}>
                            Sleep Mode
                        </Typography>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: tokens.spacing.lg,
        alignItems: 'flex-end',
    },
    closeButton: {
        width: 48,
        height: 48,
        borderRadius: tokens.roundness.full,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: tokens.spacing.xl,
    },
    artPlaceholder: {
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: tokens.roundness.xl,
        overflow: 'hidden',
        marginBottom: tokens.spacing.xxl,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    artGradient: {
        flex: 1,
    },
    info: {
        alignItems: 'center',
        marginBottom: tokens.spacing.xxl,
    },
    title: {
        textAlign: 'center',
        marginBottom: tokens.spacing.sm,
    },
    progressContainer: {
        width: '100%',
        marginBottom: tokens.spacing.xl,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        marginBottom: tokens.spacing.sm,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: tokens.spacing.xxl,
    },
    controlButton: {
        padding: tokens.spacing.md,
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: tokens.spacing.xl,
    },
    footer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        marginTop: tokens.spacing.xl,
    },
    footerAction: {
        alignItems: 'center',
    },
    footerLabel: {
        marginTop: tokens.spacing.xs,
    },
});
