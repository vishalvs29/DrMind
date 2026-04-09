import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSessionStore } from '../store/sessionStore';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { tokens } from '../theme/tokens';
import { useTheme } from '../theme/ThemeContext';
import { sessionService } from '../services/sessionService';

const { width } = Dimensions.get('window');

export const SessionPlayerScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const {
        currentSession,
        currentStepIndex,
        progressSeconds,
        isCompleted,
        updateProgress,
        nextStep,
        reset
    } = useSessionStore();

    const [isPlaying, setIsPlaying] = useState(true);
    const saveInterval = useRef<NodeJS.Timeout | null>(null);
    const completionFired = useRef(false);

    const currentStep = currentSession?.steps[currentStepIndex];

    // Explicit completion callback — fires when the store marks the session done.
    // Guarded by a ref to avoid duplicate API calls if the store already called it via nextStep().
    useEffect(() => {
        if (isCompleted && currentSession && !completionFired.current) {
            completionFired.current = true;
            sessionService.completeSession(currentSession.id).catch((err) =>
                console.warn('completeSession screen callback failed:', err)
            );
        }
    }, [isCompleted, currentSession]);

    useEffect(() => {
        // 5-second auto-save throttle — stops once the session is complete.
        saveInterval.current = setInterval(() => {
            if (currentSession && isPlaying && !isCompleted) {
                sessionService.saveProgress({
                    sessionId: currentSession.id,
                    currentStepIndex,
                    progressSeconds: progressSeconds + 5,
                });
                updateProgress(progressSeconds + 5);
            }
        }, 5000);

        return () => {
            if (saveInterval.current) clearInterval(saveInterval.current);
        };
    }, [currentSession, currentStepIndex, progressSeconds, isPlaying, isCompleted]);

    const handleClose = () => {
        reset();
        navigation.goBack();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!currentSession || !currentStep) return null;

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#1A1D1E', '#0B0F11']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={handleClose}>
                    <X color="#FFFFFF" size={24} />
                </TouchableOpacity>
                <Typography variant="labelLg" color="#FFFFFF">
                    {currentStepIndex + 1} of {currentSession.steps.length}
                </Typography>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.albumArt}>
                    <LinearGradient
                        colors={[theme.primary, theme.secondary]}
                        style={styles.artGradient}
                    />
                </View>

                <Typography variant="displaySm" color="#FFFFFF" style={styles.title}>
                    {currentStep.title}
                </Typography>
                <Typography variant="bodyMd" color="rgba(255,255,255,0.6)">
                    {currentSession.title}
                </Typography>

                <View style={styles.progressSection}>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${(progressSeconds / currentStep.duration) * 100}%`,
                                    backgroundColor: theme.primary
                                }
                            ]}
                        />
                    </View>
                    <View style={styles.timeRow}>
                        <Typography variant="labelSm" color="rgba(255,255,255,0.6)">
                            {formatTime(progressSeconds)}
                        </Typography>
                        <Typography variant="labelSm" color="rgba(255,255,255,0.6)">
                            {formatTime(currentStep.duration)}
                        </Typography>
                    </View>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity style={styles.controlButton}>
                        <SkipBack color="#FFFFFF" size={32} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.playButton, { backgroundColor: theme.primary }]}
                        onPress={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? (
                            <Pause color="#000000" size={32} fill="#000000" />
                        ) : (
                            <Play color="#000000" size={32} fill="#000000" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.controlButton} onPress={nextStep}>
                        <SkipForward color="#FFFFFF" size={32} />
                    </TouchableOpacity>
                </View>

                <View style={styles.stepsList}>
                    {currentSession.steps.map((step, index) => (
                        <View key={step.id} style={styles.stepIndicator}>
                            <View
                                style={[
                                    styles.dot,
                                    index === currentStepIndex ? { backgroundColor: theme.primary } :
                                        index < currentStepIndex ? { backgroundColor: 'rgba(255,255,255,0.8)' } :
                                            { backgroundColor: 'rgba(255,255,255,0.2)' }
                                ]}
                            />
                            <Typography
                                variant="labelSm"
                                color={index === currentStepIndex ? "#FFFFFF" : "rgba(255,255,255,0.4)"}
                                style={{ marginLeft: 8 }}
                            >
                                {step.title}
                            </Typography>
                        </View>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: tokens.spacing.lg,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: tokens.spacing.xl,
    },
    albumArt: {
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: tokens.spacing.xxl,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    artGradient: { flex: 1 },
    title: { marginBottom: tokens.spacing.xs, textAlign: 'center' },
    progressSection: {
        width: '100%',
        marginTop: tokens.spacing.xxl,
        marginBottom: tokens.spacing.xl,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: tokens.spacing.sm,
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
    stepsList: {
        width: '100%',
        marginTop: tokens.spacing.xl,
    },
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: tokens.spacing.sm,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
});
