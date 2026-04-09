import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { TrendingUp, Activity, Flame, ShieldAlert } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { analyticsService } from '../services/AnalyticsService';

const { width } = Dimensions.get('window');

export const InsightsScreen = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [moodRes, insightRes] = await Promise.all([
                    analyticsService.getMoodHistory(),
                    analyticsService.getInsights()
                ]);
                setData({
                    moodHistory: moodRes.data,
                    ...insightRes.data
                });
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={[styles.safeArea, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    if (!data) return null;

    const renderMoodChart = () => {
        return (
            <View style={styles.chartContainer}>
                {data.moodHistory.map((entry: any, index: number) => {
                    const barHeight = (entry.level / 5) * 100;
                    return (
                        <View key={index} style={styles.barWrapper}>
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        height: barHeight,
                                        backgroundColor: analyticsService.getMoodColor(entry.level)
                                    }
                                ]}
                            />
                            <Typography variant="labelSm" style={{ color: theme.onSurfaceVariant }}>
                                {new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: 'short' })}
                            </Typography>
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

                <Card variant="low" style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <TrendingUp size={20} color={theme.primary} />
                        <Typography variant="headlineSm" style={{ marginLeft: 8 }}>Weekly Mood Trend</Typography>
                    </View>
                    {renderMoodChart()}
                </Card>

                <View style={styles.statsGrid}>
                    <Card variant="low" style={styles.statCard}>
                        <Activity size={24} color={theme.secondary} />
                        <Typography variant="displaySm" style={styles.statValue}>{data.engagement.completedSessions * 10 || 0}</Typography>
                        <Typography variant="labelSm" style={{ color: theme.onSurfaceVariant }}>Session Minutes</Typography>
                    </Card>
                    <Card variant="low" style={styles.statCard}>
                        <Flame size={24} color="#FF8C00" />
                        <Typography variant="displaySm" style={styles.statValue}>{data.engagement.streakDays || 0}</Typography>
                        <Typography variant="labelSm" style={{ color: theme.onSurfaceVariant }}>Day Streak</Typography>
                    </Card>
                </View>

                <Card variant="high" style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View>
                            <Typography variant="headlineSm">Stability: {data.riskLevel}</Typography>
                            <Typography variant="bodySm" style={{ color: theme.onSurfaceVariant }}>
                                Based on your consistent session frequency.
                            </Typography>
                        </View>
                        <View style={[styles.statusDot, { backgroundColor: data.riskLevel === 'LOW' ? theme.secondary : '#FFA500' }]} />
                    </View>
                </Card>

                <Card variant="low" style={[styles.infoCard, { borderLeftWidth: 4, borderLeftColor: theme.secondary }]}>
                    <View style={styles.infoRow}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ShieldAlert size={20} color={theme.secondary} />
                                <Typography variant="headlineSm" style={{ marginLeft: 8 }}>Mental Resilience</Typography>
                            </View>
                            <Typography variant="bodySm" style={[styles.insightBody, { color: theme.onSurfaceVariant }]}>
                                Stress Score: {data.stressScore}/100. Your trends indicate positive emotional regulation.
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
