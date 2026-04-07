import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Lock, CheckCircle2, ChevronRight, GraduationCap, Building2, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { programService, Program } from '../services/ProgramService';

export const ProgramsScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const programs = programService.getPrograms();
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Student': return <GraduationCap size={20} color={theme.primary} />;
            case 'Corporate': return <Building2 size={20} color={theme.secondary} />;
            case 'Police/Military': return <ShieldCheck size={20} color={theme.tertiary} />;
            default: return null;
        }
    };

    if (selectedProgram) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setSelectedProgram(null)}>
                        <Typography variant="labelLg" color={theme.primary}>← Back to Programs</Typography>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.container}>
                    <Typography variant="displaySm" style={styles.programTitle}>
                        {selectedProgram.title}
                    </Typography>
                    <Typography variant="bodyMd" color={theme.onSurfaceVariant} style={styles.programDesc}>
                        {selectedProgram.description}
                    </Typography>

                    <View style={styles.sessionList}>
                        {selectedProgram.sessions.map((session) => (
                            <Card
                                key={session.id}
                                variant={session.isLocked ? 'low' : 'lowest'}
                                style={[styles.sessionItem, session.isLocked ? { opacity: 0.6 } : null] as any}
                                onPress={() => !session.isLocked && navigation.navigate('SessionPlayer', { sessionId: session.id })}
                            >
                                <View style={styles.sessionRow}>
                                    <View style={styles.sessionStatus}>
                                        {session.isCompleted ? (
                                            <CheckCircle2 size={24} color={theme.secondary} />
                                        ) : session.isLocked ? (
                                            <Lock size={24} color={theme.outline} />
                                        ) : (
                                            <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />
                                        )}
                                    </View>
                                    <View style={styles.sessionInfo}>
                                        <Typography
                                            variant="headlineSm"
                                            color={session.isLocked ? theme.onSurfaceVariant : theme.onSurface}
                                        >
                                            {session.title}
                                        </Typography>
                                        <Typography variant="labelSm" color={theme.onSurfaceVariant}>
                                            Day {session.day} • {session.duration}
                                        </Typography>
                                    </View>
                                    {!session.isLocked && <ChevronRight size={20} color={theme.outline} />}
                                </View>
                            </Card>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.container}>
                <Typography variant="displaySm" style={styles.headerTitle}>
                    Guided Programs
                </Typography>
                <Typography variant="bodyMd" color={theme.onSurfaceVariant} style={styles.headerSubtitle}>
                    Structured journeys for your mental resilience.
                </Typography>

                {programs.map((program) => (
                    <Card key={program.id} style={styles.programCard} onPress={() => setSelectedProgram(program)}>
                        <View style={styles.categoryBadge}>
                            {getCategoryIcon(program.category)}
                            <Typography variant="labelSm" style={{ marginLeft: tokens.spacing.xs }}>
                                {program.category}
                            </Typography>
                        </View>
                        <Typography variant="headlineSm" style={styles.cardTitle}>{program.title}</Typography>
                        <Typography variant="bodySm" color={theme.onSurfaceVariant} numberOfLines={2}>
                            {program.description}
                        </Typography>

                        <View style={styles.progressSection}>
                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        {
                                            width: `${program.progress * 100}%`,
                                            backgroundColor: theme.primary
                                        }
                                    ]}
                                />
                            </View>
                            <Typography variant="labelSm" color={theme.onSurfaceVariant}>
                                {Math.round(program.progress * 100)}% Complete
                            </Typography>
                        </View>
                    </Card>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { padding: tokens.spacing.lg, paddingBottom: tokens.spacing.xxl },
    header: { padding: tokens.spacing.lg },
    headerTitle: { marginBottom: tokens.spacing.xs },
    headerSubtitle: { marginBottom: tokens.spacing.xl },
    programTitle: { marginBottom: tokens.spacing.sm },
    programDesc: { marginBottom: tokens.spacing.xl },
    programCard: { marginBottom: tokens.spacing.md },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: tokens.spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignSelf: 'flex-start',
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: 2,
        borderRadius: tokens.roundness.sm,
    },
    cardTitle: { marginBottom: tokens.spacing.xs },
    progressSection: { marginTop: tokens.spacing.md },
    progressBarBg: {
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 2,
        marginBottom: tokens.spacing.xs
    },
    progressBarFill: { height: '100%', borderRadius: 2 },
    sessionList: { marginTop: tokens.spacing.md },
    sessionItem: { marginBottom: tokens.spacing.sm },
    sessionRow: { flexDirection: 'row', alignItems: 'center' },
    sessionStatus: { width: 40, alignItems: 'center' },
    activeDot: { width: 12, height: 12, borderRadius: 6 },
    sessionInfo: { flex: 1, marginLeft: tokens.spacing.sm },
});
