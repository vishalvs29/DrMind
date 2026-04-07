import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    variant?: 'low' | 'lowest' | 'high' | 'highest' | 'primary';
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    onPress,
    variant = 'lowest'
}) => {
    const { theme } = useTheme();

    const getBackgroundColor = () => {
        switch (variant) {
            case 'low': return theme.surfaceContainerLow;
            case 'lowest': return theme.surfaceContainerLowest;
            case 'high': return theme.surfaceContainerHigh;
            case 'highest': return theme.surfaceContainerHighest;
            case 'primary': return theme.primaryContainer;
            default: return theme.surfaceContainerLowest;
        }
    };

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.card,
                {
                    backgroundColor: getBackgroundColor(),
                    borderRadius: tokens.roundness.xl,
                },
                style
            ]}
        >
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: tokens.spacing.md,
        marginVertical: tokens.spacing.sm,
        // No borders as per design system
    },
});
