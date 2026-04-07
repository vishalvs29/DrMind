import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Typography } from './Typography';

interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    variant?: 'primary' | 'secondary' | 'tertiary';
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    style,
    textStyle,
    variant = 'primary'
}) => {
    const { theme } = useTheme();

    if (variant === 'primary') {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, style]}>
                <LinearGradient
                    colors={[theme.primary, theme.primaryContainer]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <Typography variant="labelLg" color={theme.onPrimary} style={textStyle}>
                        {title}
                    </Typography>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    const getBgColor = () => {
        if (variant === 'secondary') return theme.surfaceContainerHighest;
        return 'transparent';
    };

    const getTextColor = () => {
        return theme.primary;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.secondaryButton,
                { backgroundColor: getBgColor() },
                style
            ]}
        >
            <Typography variant="labelLg" color={getTextColor()} style={textStyle}>
                {title}
            </Typography>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: tokens.roundness.full,
        overflow: 'hidden',
        height: 48,
        justifyContent: 'center',
        marginVertical: tokens.spacing.sm,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.lg,
    },
    secondaryButton: {
        height: 48,
        borderRadius: tokens.roundness.full,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.lg,
        marginVertical: tokens.spacing.sm,
    },
});
