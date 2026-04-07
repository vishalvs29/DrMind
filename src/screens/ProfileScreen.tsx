import React from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { User, Settings, Bell, Moon, LogOut, Award, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';

export const ProfileScreen = ({ navigation }: any) => {
    const { theme, isDark, toggleTheme } = useTheme();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <View style={[styles.avatar, { backgroundColor: theme.primaryContainer }]}>
                        <User size={40} color={theme.onPrimaryContainer} />
                    </View>
                    <Typography variant="displaySm" style={styles.userName}>Alex Johnson</Typography>
                    <Typography variant="bodyMd" color={theme.onSurfaceVariant}>Premium Member</Typography>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Typography variant="headlineSm">12</Typography>
                        <Typography variant="labelSm" color={theme.onSurfaceVariant}>Badges</Typography>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: theme.outlineVariant }]} />
                    <View style={styles.statItem}>
                        <Typography variant="headlineSm">45</Typography>
                        <Typography variant="labelSm" color={theme.onSurfaceVariant}>Sessions</Typography>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: theme.outlineVariant }]} />
                    <View style={styles.statItem}>
                        <Typography variant="headlineSm">5</Typography>
                        <Typography variant="labelSm" color={theme.onSurfaceVariant}>Streak</Typography>
                    </View>
                </View>

                {/* Settings Groups */}
                <View style={styles.section}>
                    <Typography variant="labelLg" color={theme.primary} style={styles.sectionTitle}>
                        Preferences
                    </Typography>
                    <Card style={styles.settingCard}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingLabelGroup}>
                                <Moon size={20} color={theme.onSurface} />
                                <Typography variant="bodyMd" style={{ marginLeft: 12 }}>Dark Mode</Typography>
                            </View>
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{ false: theme.outlineVariant, true: theme.primary }}
                            />
                        </View>
                    </Card>
                    <Card style={styles.settingCard} onPress={() => console.log('Notifications')}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingLabelGroup}>
                                <Bell size={20} color={theme.onSurface} />
                                <Typography variant="bodyMd" style={{ marginLeft: 12 }}>Notifications</Typography>
                            </View>
                            <ChevronRight size={20} color={theme.outline} />
                        </View>
                    </Card>
                </View>

                <View style={styles.section}>
                    <Typography variant="labelLg" color={theme.primary} style={styles.sectionTitle}>
                        Account
                    </Typography>
                    <Card style={styles.settingCard} onPress={() => console.log('Achievements')}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingLabelGroup}>
                                <Award size={20} color={theme.onSurface} />
                                <Typography variant="bodyMd" style={{ marginLeft: 12 }}>Achievements</Typography>
                            </View>
                            <ChevronRight size={20} color={theme.outline} />
                        </View>
                    </Card>
                    <Card style={styles.settingCard} onPress={() => console.log('Settings')}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingLabelGroup}>
                                <Settings size={20} color={theme.onSurface} />
                                <Typography variant="bodyMd" style={{ marginLeft: 12 }}>Settings</Typography>
                            </View>
                            <ChevronRight size={20} color={theme.outline} />
                        </View>
                    </Card>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <LogOut size={20} color={theme.error} />
                    <Typography variant="labelLg" color={theme.error} style={{ marginLeft: 8 }}>
                        Log Out
                    </Typography>
                </TouchableOpacity>

                <Typography variant="labelSm" color={theme.onSurfaceVariant} style={styles.version}>
                    DrMindit v1.0.0
                </Typography>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { padding: tokens.spacing.lg, paddingBottom: tokens.spacing.xxl },
    header: { alignItems: 'center', marginVertical: tokens.spacing.xl },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: tokens.spacing.md,
    },
    userName: { marginBottom: 4 },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: tokens.spacing.xxl,
        paddingVertical: tokens.spacing.md,
    },
    statItem: { alignItems: 'center' },
    statDivider: { width: 1, height: 30 },
    section: { marginBottom: tokens.spacing.xl },
    sectionTitle: { marginBottom: tokens.spacing.md, marginLeft: tokens.spacing.xs },
    settingCard: { marginBottom: tokens.spacing.xs, paddingVertical: tokens.spacing.md },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    settingLabelGroup: { flexDirection: 'row', alignItems: 'center' },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: tokens.spacing.xxl,
        padding: tokens.spacing.md,
    },
    version: { textAlign: 'center', marginTop: tokens.spacing.xl, opacity: 0.5 },
});
