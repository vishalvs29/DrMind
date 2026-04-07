import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, ClipboardList, MessageCircle, BarChart2, User } from 'lucide-react-native';
import {
    HomeScreen,
    ProgramsScreen,
    ChatScreen,
    InsightsScreen,
    ProfileScreen,
    SessionPlayerScreen,
    SleepModeScreen
} from '../screens';
import { useTheme } from '../theme/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.onSurfaceVariant,
                tabBarStyle: {
                    backgroundColor: theme.surface,
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 60,
                    paddingBottom: 10,
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Programs"
                component={ProgramsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="AI Chat"
                component={ChatScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Insights"
                component={InsightsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />
                }}
            />
        </Tab.Navigator>
    );
};

export const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
                name="SessionPlayer"
                component={SessionPlayerScreen}
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name="SleepMode"
                component={SleepModeScreen}
                options={{ presentation: 'modal' }}
            />
        </Stack.Navigator>
    );
};
