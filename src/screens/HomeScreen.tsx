import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, Alert } from 'react-native';
import { Play, MessageCircle, Moon, Zap } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { MoodCheckIn } from '../components/MoodCheckIn';
import { Button } from '../components/Button';
import { sessionService } from '../services/sessionService';
import { useSessionStore } from '../store/sessionStore';

const RECOMMENDED_SESSIONS = [
    {
        id: '1',
        title: 'Daily Resilience',
        duration: '30 min',
        type: 'Program',
        color: '#B3BDFF',
        steps: [
            { id: 's1', title: 'Brain-Heart Coherence', audioUrl: '/audio/coherence.mp3', duration: 120, order: 1 },
            { id: 's2', title: 'Wim Hof Breathing', audioUrl: '/audio/wimhof.mp3', duration: 600, order: 2 },
            { id: 's3', title: 'Bhramari Pranayama', audioUrl: '/audio/bhramari.mp3', duration: 180, order: 3 },
            { id: 's4', title: 'Meditation', audioUrl: '/audio/meditation.mp3', duration: 900, order: 4 },
        ]
    },
];

export const HomeScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { startSession } = useSessionStore();

    useEffect(() => {
        const checkResume = async () => {
            try {
                const res = await sessionService.getResumeProgress();
                if (res.data && !res.data.isCompleted) {
                    Alert.alert(
                        "Continue Session",
                        `Would you like to resume your session: ${res.data.session.title}?`,
                        [
                            { text: "Discard", style: "destructive" },
                            {
                                text: "Resume",
                                onPress: () => {
                                    startSession(res.data.session, res.data);
                                    navigation.navigate('SessionPlayer');
                                }
                            }
                        ]
                    );
                }
            } catch (e) {
                console.warn('Resume check failed', e);
            }
        };
        checkResume();
    }, []);

    const handleStartSession = (session: any) => {
        startSession(session);
        navigation.navigate('SessionPlayer');
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Typography variant="displaySm" style={styles.greeting}>
                        Good Afternoon,
                    </Typography>
                    <Typography variant="displayMd" color={theme.primary}>
                        DrMindit User
                    </Typography>
                </View>

                {/* Mood Check-in */}
                <MoodCheckIn />

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Typography variant="headlineSm" style={styles.sectionTitle}>
                        Quick Actions
                    </Typography>
                    <View style={styles.quickActions}>
                        <Card
                            variant="primary"
                            style={styles.quickActionCard}
                            onPress={() => handleStartSession(RECOMMENDED_SESSIONS[0])}
                        >
                            <Play color={theme.onPrimaryContainer} size={24} />
                            <Typography variant="labelMd" color={theme.onPrimaryContainer} style={styles.quickActionLabel}>
                                Start Session
                            </Typography>
                        </Card>
                        <Card
                            variant="high"
                            style={styles.quickActionCard}
                            onPress={() => navigation.navigate('AI Chat')}
                        >
                            <MessageCircle color={theme.primary} size={24} />
                            <Typography variant="labelMd" color={theme.primary} style={styles.quickActionLabel}>
                                AI Chat
                            </Typography>
                        </Card>
                        <Card
                            variant="high"
                            style={styles.quickActionCard}
                            onPress={() => navigation.navigate('SleepMode')}
                        >
                            <Moon color={theme.secondary} size={24} />
                            <Typography variant="labelMd" color={theme.secondary} style={styles.quickActionLabel}>
                                Sleep
                            </Typography>
                        </Card>
                    </View>
                </View>

                {/* Recommended Sessions */}
                <View style={styles.section}>
                    <Typography variant="headlineSm" style={styles.sectionTitle}>
                        Recommended for You
                    </Typography>
                    {RECOMMENDED_SESSIONS.map((session) => (
                        <Card key={session.id} style={styles.sessionCard} onPress={() => handleStartSession(session)}>
                            <View style={styles.sessionInfo}>
                                <View style={[styles.iconContainer, { backgroundColor: session.color }]}>
                                    <Zap size={20} color={theme.onSurface} />
                                </View>
                                <View style={styles.sessionText}>
                                    <Typography variant="headlineSm">{session.title}</Typography>
                                    <Typography variant="bodySm" color={theme.onSurfaceVariant}>
                                        {session.type} • {session.duration}
                                    </Typography>
                                </View>
                                <Play size={24} color={theme.primary} />
                            </View>
                        </Card>
                    ))}
                </View>

                <Card variant="low" style={styles.progressCard}>
                    <Typography variant="headlineSm">Your Progress</Typography>
                    <Typography variant="bodyMd" style={{ marginTop: tokens.spacing.xs }}>
                        You've completed 5 sessions this week! Keep it up.
                    </Typography>
                    <Button
                        title="View Details"
                        variant="secondary"
                        onPress={() => navigation.navigate('Insights')}
                        style={{ marginTop: tokens.spacing.md }}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { paddingBottom: tokens.spacing.xxl },
    header: { padding: tokens.spacing.lg, paddingTop: tokens.spacing.xxl },
    greeting: { opacity: 0.7 },
    section: { paddingHorizontal: tokens.spacing.lg, marginTop: tokens.spacing.xl },
    sectionTitle: { marginBottom: tokens.spacing.md },
    quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
    quickActionCard: {
        flex: 1,
        marginHorizontal: tokens.spacing.xs,
        alignItems: 'center',
        padding: tokens.spacing.md,
        height: 100,
        justifyContent: 'center',
    },
    quickActionLabel: { marginTop: tokens.spacing.sm, textAlign: 'center' },
    sessionCard: { marginBottom: tokens.spacing.sm },
    sessionInfo: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: tokens.roundness.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: tokens.spacing.md,
    },
    sessionText: { flex: 1 },
    progressCard: { margin: tokens.spacing.lg, marginTop: tokens.spacing.xl },
});
