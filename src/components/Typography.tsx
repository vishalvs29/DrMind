import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';

interface TypographyProps {
    children: React.ReactNode;
    variant?: keyof typeof tokens.typography.sizes;
    style?: TextStyle;
    color?: string;
    numberOfLines?: number;
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'bodyMd',
    style,
    color,
    numberOfLines
}) => {
    const { theme } = useTheme();

    const getFontFamily = () => {
        if (variant.startsWith('display') || variant.startsWith('headline')) {
            return tokens.typography.fontFamily.headline;
        }
        if (variant.startsWith('label')) {
            return tokens.typography.fontFamily.label;
        }
        return tokens.typography.fontFamily.body;
    };

    return (
        <Text
            numberOfLines={numberOfLines}
            style={[
                {
                    fontSize: tokens.typography.sizes[variant],
                    fontFamily: getFontFamily(),
                    color: color || theme.onSurface,
                },
                style
            ]}
        >
            {children}
        </Text>
    );
};
