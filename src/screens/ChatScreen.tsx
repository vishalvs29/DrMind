import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { Send, Phone, Info } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { chatService, Message } from '../services/ChatService';

export const ChatScreen = () => {
    const { theme } = useTheme();
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '0',
            text: "Hello! I'm your AI mental health companion. How are you feeling today?",
            sender: 'ai',
            timestamp: new Date(),
        }
    ]);
    const flatListRef = useRef<FlatList>(null);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const newMessages = await chatService.sendMessage(inputText);
        setMessages(prev => [...prev, ...newMessages]);
        setInputText('');

        // Check for crisis
        if (newMessages.some(m => m.sender === 'ai' && m.intent === 'crisis_alert')) {
            Alert.alert(
                "Safe Support",
                "It sounds like you're going through a lot. Please remember that you can call a professional helpline at any time.",
                [
                    { text: "Call 988 (Helpline)", onPress: () => console.log('Calling helpline...') },
                    { text: "Continue Chat", style: 'cancel' }
                ]
            );
        }

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';

        return (
            <View style={[
                styles.messageWrapper,
                isUser ? styles.userWrapper : styles.aiWrapper
            ]}>
                <View style={[
                    styles.messageBubble,
                    isUser
                        ? { backgroundColor: theme.primary, borderBottomRightRadius: 4 }
                        : { backgroundColor: theme.surfaceContainerHigh, borderBottomLeftRadius: 4 }
                ]}>
                    <Typography
                        variant="bodyMd"
                        color={isUser ? theme.onPrimary : theme.onSurface}
                    >
                        {item.text}
                    </Typography>
                </View>
                <Typography variant="labelSm" color={theme.onSurfaceVariant} style={styles.timestamp}>
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View>
                    <Typography variant="headlineSm">AI Chat Therapy</Typography>
                    <Typography variant="labelSm" color={theme.secondary}>Secure & Private</Typography>
                </View>
                <TouchableOpacity
                    style={[styles.helplineButton, { backgroundColor: theme.errorContainer }]}
                    onPress={() => Alert.alert("Helplines", "National Suicide Prevention: 988\nCrisis Text Line: Text HOME to 741741")}
                >
                    <Phone size={20} color={theme.onErrorContainer} />
                    <Typography variant="labelSm" color={theme.onErrorContainer} style={{ marginLeft: 4 }}>
                        SOS
                    </Typography>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.listContent}
                />

                <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.surfaceContainerLow,
                                color: theme.onSurface,
                                borderColor: theme.outlineVariant
                            }
                        ]}
                        placeholder="Type your message..."
                        placeholderTextColor={theme.onSurfaceVariant}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: theme.primary }]}
                        onPress={handleSend}
                    >
                        <Send size={24} color={theme.onPrimary} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        padding: tokens.spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    helplineButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: 6,
        borderRadius: tokens.roundness.full,
    },
    keyboardView: { flex: 1 },
    listContent: { padding: tokens.spacing.lg },
    messageWrapper: {
        marginBottom: tokens.spacing.md,
        maxWidth: '80%',
    },
    userWrapper: { alignSelf: 'flex-end' },
    aiWrapper: { alignSelf: 'flex-start' },
    messageBubble: {
        padding: tokens.spacing.md,
        borderRadius: tokens.roundness.lg,
    },
    timestamp: {
        marginTop: 4,
        alignSelf: 'flex-end',
        fontSize: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: tokens.spacing.md,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    input: {
        flex: 1,
        borderRadius: tokens.roundness.full,
        paddingHorizontal: tokens.spacing.lg,
        paddingVertical: 10,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: tokens.spacing.sm,
    },
});
