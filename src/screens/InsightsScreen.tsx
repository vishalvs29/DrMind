import React from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, Dimensions } from 'react-native';
import { TrendingUp, Activity, Flame, ShieldAlert } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { analyticsService } from '../services/AnalyticsService';

const { width } = Dimensions.get('window');

export const InsightsScreen = () => {
    const { theme } = useTheme();
    const data = analyticsService.getAnalytics();

    const renderMoodChart = () => {
        return (
            <View style={styles.chartContainer}>
                {data.moodHistory.map((entry, index) => {
                    const barHeight = (entry.level / 5) * 100;
                    return (
                        <View key={index} style={styles.barWrapper}>
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        height: barHeight,
                                        backgroundColor: analyticsService.getMoodColor(entry.mood)
                                    }
                                ]}
                            />
                            <Typography variant="labelSm" style={{ color: theme.onSurfaceVariant }}>{entry.date}</Typography>
                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.container}>
                <Typography variant="displaySm" style={styles.headerTitle}>
                    Your Insights
                </Typography>
                <Typography variant="bodyMd" style={[styles.headerSubtitle, { color: theme.onSurfaceVariant }]}>
                    Understanding your mental wellness journey.
                </Typography>

                {/* Weekly Mood Trend */}
                <Card variant="lowest" style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <TrendingUp size={20} color={theme.primary} />
                        <Typography variant="headlineSm" style={{ marginLeft: 8 }}>Weekly Mood Trend</Typography>
                    </View>
                    {renderMoodChart()}
                </Card>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <Card variant="low" style={styles.statCard}>
                        <Activity size={24} color={theme.secondary} />
                        <Typography variant="displaySm" style={styles.statValue}>{data.sessionMinutes}</Typography>
                        <Typography variant="labelSm" style={{ color: theme.onSurfaceVariant }}>Session Minutes</Typography>
                    </Card>
                    <Card variant="low" style={styles.statCard}>
                        <Flame size={24} color="#FF8C00" />
                        <Typography variant="displaySm" style={styles.statValue}>{data.streakDays}</Typography>
                        <Typography variant="labelSm" style={{ color: theme.onSurfaceVariant }}>Day Streak</Typography>
                    </Card>
                </View>

                {/* Stress & Risk Level */}
                <Card variant="high" style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View>
                            <Typography variant="headlineSm">Current Stress: {data.stressLevel}</Typography>
                            <Typography variant="bodySm" style={{ color: theme.onSurfaceVariant }}>
                                Based on your heart rate and session frequency.
                            </Typography>
                        </View>
                        <View style={[styles.statusDot, { backgroundColor: data.stressLevel === 'Low' ? theme.secondary : '#FFA500' }]} />
                    </View>
                </Card>

                <Card variant="lowest" style={[styles.infoCard, { borderLeftWidth: 4, borderLeftColor: theme.secondary }]}>
                    <View style={styles.infoRow}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ShieldAlert size={20} color={theme.secondary} />
                                <Typography variant="headlineSm" style={{ marginLeft: 8 }}>Risk Detection: {data.riskStatus}</Typography>
                            </View>
                            <Typography variant="bodySm" style={[styles.insightBody, { color: theme.onSurfaceVariant }]}>
                                Your mental health indicators show stability. Keep up your routine!
                            </Typography>
                        </View>
                    </View>
                </Card>

                <Typography variant="bodySm" style={[styles.footerNote, { color: theme.onSurfaceVariant }]}>
                    * Insights are for informational purposes only and not a clinical diagnosis.
                </Typography>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { padding: tokens.spacing.lg, paddingBottom: tokens.spacing.xxl },
    headerTitle: { marginBottom: tokens.spacing.xs },
    headerSubtitle: { marginBottom: tokens.spacing.xl },
    sectionCard: { marginBottom: tokens.spacing.md, padding: tokens.spacing.lg },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.xl },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 150,
        paddingTop: 20
    },
    barWrapper: { alignItems: 'center', justifyContent: 'flex-end', height: '100%', width: 40 },
    bar: { width: 12, borderRadius: 6, marginBottom: 8 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: tokens.spacing.md },
    statCard: { flex: 1, marginHorizontal: 4, padding: tokens.spacing.lg, alignItems: 'center' },
    statValue: { marginVertical: 4 },
    infoCard: { marginBottom: tokens.spacing.md },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusDot: { width: 16, height: 16, borderRadius: 8 },
    insightBody: { marginTop: 4 },
    footerNote: { textAlign: 'center', marginTop: tokens.spacing.xl, fontStyle: 'italic' },
});
