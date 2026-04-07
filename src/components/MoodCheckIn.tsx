import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Smile, Cloud, Meh, Frown, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Typography } from './Typography';
import { Card } from './Card';

const MOODS = [
    { id: 'happy', label: 'Happy', Icon: Smile, color: '#FFD700' },
    { id: 'calm', label: 'Calm', Icon: Cloud, color: '#87CEEB' },
    { id: 'neutral', label: 'Neutral', Icon: Meh, color: '#B0C4DE' },
    { id: 'sad', label: 'Sad', Icon: Frown, color: '#4682B4' },
    { id: 'anxious', label: 'Anxious', Icon: AlertCircle, color: '#F4A460' },
];

export const MoodCheckIn = () => {
    const { theme } = useTheme();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    return (
        <Card variant="low" style={styles.container}>
            <Typography variant="headlineSm" style={styles.title}>
                How are you feeling today?
            </Typography>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.moodScroll}
            >
                {MOODS.map((mood) => {
                    const isSelected = selectedMood === mood.id;
                    const { Icon } = mood;

                    return (
                        <TouchableOpacity
                            key={mood.id}
                            onPress={() => setSelectedMood(mood.id)}
                            activeOpacity={0.7}
                            style={[
                                styles.moodChip,
                                {
                                    backgroundColor: isSelected ? theme.primaryContainer : theme.surfaceContainerLowest,
                                }
                            ]}
                        >
                            <Icon
                                size={24}
                                color={isSelected ? theme.onPrimaryContainer : theme.onSurfaceVariant}
                            />
                            <Typography
                                variant="labelSm"
                                color={isSelected ? theme.onPrimaryContainer : theme.onSurfaceVariant}
                                style={styles.moodLabel}
                            >
                                {mood.label}
                            </Typography>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: tokens.spacing.md,
    },
    title: {
        marginBottom: tokens.spacing.md,
    },
    moodScroll: {
        paddingRight: tokens.spacing.md,
    },
    moodChip: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: tokens.spacing.md,
        borderRadius: tokens.roundness.xl,
        marginRight: tokens.spacing.sm,
        width: 80,
        height: 90,
    },
    moodLabel: {
        marginTop: tokens.spacing.xs,
    },
});
