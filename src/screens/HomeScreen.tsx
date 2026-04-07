import React from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView } from 'react-native';
import { Play, MessageCircle, Moon, Zap } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { MoodCheckIn } from '../components/MoodCheckIn';
import { Button } from '../components/Button';

const RECOMMENDED_SESSIONS = [
    { id: '1', title: 'Morning Clarity', duration: '10 min', type: 'Meditation', color: '#B3BDFF' },
    { id: '2', title: 'Stress Release', duration: '15 min', type: 'Anxiety', color: '#A7F3EC' },
    { id: '3', title: 'Deep Sleep', duration: '20 min', type: 'Sleep', color: '#D6BEFF' },
];

export const HomeScreen = ({ navigation }: any) => {
    const { theme } = useTheme();

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
                            onPress={() => navigation.navigate('SessionPlayer')}
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
                            onPress={() => console.log('Sleep Mode')}
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
                        <Card key={session.id} style={styles.sessionCard} onPress={() => navigation.navigate('SessionPlayer')}>
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

                {/* Progress Summary Placeholder */}
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
    safeArea: {
        flex: 1,
    },
    container: {
        paddingBottom: tokens.spacing.xxl,
    },
    header: {
        padding: tokens.spacing.lg,
        paddingTop: tokens.spacing.xxl,
    },
    greeting: {
        opacity: 0.7,
    },
    section: {
        paddingHorizontal: tokens.spacing.lg,
        marginTop: tokens.spacing.xl,
    },
    sectionTitle: {
        marginBottom: tokens.spacing.md,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickActionCard: {
        flex: 1,
        marginHorizontal: tokens.spacing.xs,
        alignItems: 'center',
        padding: tokens.spacing.md,
        height: 100,
        justifyContent: 'center',
    },
    quickActionLabel: {
        marginTop: tokens.spacing.sm,
        textAlign: 'center',
    },
    sessionCard: {
        marginBottom: tokens.spacing.sm,
    },
    sessionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: tokens.roundness.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: tokens.spacing.md,
    },
    sessionText: {
        flex: 1,
    },
    progressCard: {
        margin: tokens.spacing.lg,
        marginTop: tokens.spacing.xl,
    },
});
