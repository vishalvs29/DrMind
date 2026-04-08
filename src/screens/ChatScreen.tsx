import React, { useState, useRef, useEffect } from 'react';
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
import { Send, ShieldAlert, Heart, Play } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Card } from '../components/Card';
import { Typography } from '../components/Typography';
import { CrisisResponseModal } from '../components/CrisisResponseModal';
import { processChatMessage, getLocalHelplines, Message, ChatResponse } from '../services/CrisisService';
import { audioService } from '../services/AudioService';

export const ChatScreen = () => {
    const { theme } = useTheme();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm DrMindit. I'm here to listen and support you through any emotions you're feeling.",
            sender: 'ai',
            timestamp: new Date(),
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isCrisisModalVisible, setCrisisModalVisible] = useState(false);
    const [currentResponse, setCurrentResponse] = useState<ChatResponse | null>(null);
    const flatListRef = useRef<FlatList>(null);

    const handleAction = async (response: ChatResponse) => {
        switch (response.action) {
            case 'start_session':
                if (response.audio) {
                    await audioService.play();
                }
                break;
            case 'show_helpline':
                setCrisisModalVisible(true);
                break;
            case 'suggest_session':
                // UI already shows suggestion in message text
                break;
            default:
                break;
        }
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');

        const aiResponse = await processChatMessage(userMessage.text);
        setCurrentResponse(aiResponse);

        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: aiResponse.message,
            sender: 'ai',
            timestamp: new Date(),
            emotion: aiResponse.emotion,
            action: aiResponse.action,
            audio: aiResponse.audio
        };

        setTimeout(async () => {
            setMessages(prev => [...prev, aiMessage]);
            await handleAction(aiResponse);
        }, 600);
    };

    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 200);
    }, [messages]);

    const helplines = getLocalHelplines('IN');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.outline }]}>
                <View>
                    <Typography variant="headlineSm">Emotional Intelligence</Typography>
                    <Typography variant="labelSm" style={{ color: theme.onSurfaceVariant }}>
                        Action-Aware Session Support
                    </Typography>
                </View>
                <TouchableOpacity
                    style={styles.sosCircle}
                    onPress={() => setCrisisModalVisible(true)}
                >
                    <ShieldAlert size={22} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messageList}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageWrapper,
                        item.sender === 'user' ? styles.userWrapper : styles.aiWrapper
                    ]}>
                        {item.sender === 'ai' && item.emotion && item.emotion !== 'NEUTRAL' && (
                            <View style={styles.emotionTag}>
                                <Heart size={12} color="#6366F1" fill="#6366F1" style={{ marginRight: 4 }} />
                                <Typography variant="labelSm" style={{ color: '#6366F1', fontWeight: '700' }}>
                                    {item.emotion}
                                </Typography>
                            </View>
                        )}
                        <Card
                            variant={item.sender === 'user' ? 'primary' : 'low'}
                            style={[
                                styles.messageCard,
                                item.sender === 'user' ? styles.userCard : styles.aiCard
                            ]}
                        >
                            <Typography
                                variant="bodyMd"
                                style={{ color: item.sender === 'user' ? '#FFF' : theme.onSurface }}
                            >
                                {item.text}
                            </Typography>

                            {item.action === 'suggest_session' && (
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => audioService.play()}
                                >
                                    <Play size={14} color="#6366F1" style={{ marginRight: 6 }} />
                                    <Typography variant="labelSm" style={{ color: '#6366F1', fontWeight: '700' }}>
                                        Start Guided Session
                                    </Typography>
                                </TouchableOpacity>
                            )}
                        </Card>
                    </View>
                )}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={[styles.inputArea, { borderTopColor: theme.outlineVariant }]}>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.surface, color: theme.onSurface }]}
                        placeholder="Help me understand your feelings..."
                        placeholderTextColor={theme.onSurfaceVariant}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: theme.primary }]}
                        onPress={handleSend}
                    >
                        <Send size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            <CrisisResponseModal
                visible={isCrisisModalVisible}
                onClose={() => setCrisisModalVisible(false)}
                helplines={helplines}
                riskLevel={currentResponse?.emotion === 'HOPELESSNESS' ? 'CRITICAL' : 'HIGH'}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1
    },
    sosCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center'
    },
    messageList: { padding: 20, paddingBottom: 40 },
    messageWrapper: { marginBottom: 20, maxWidth: '85%' },
    userWrapper: { alignSelf: 'flex-end' },
    aiWrapper: { alignSelf: 'flex-start' },
    emotionTag: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        alignSelf: 'flex-start'
    },
    messageCard: { padding: 16, borderRadius: 20 },
    userCard: { backgroundColor: '#6366F1' },
    aiCard: { backgroundColor: '#F3F4F6' },
    actionButton: {
        marginTop: 12,
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputArea: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1
    },
    input: {
        flex: 1,
        minHeight: 52,
        maxHeight: 120,
        borderRadius: 26,
        paddingHorizontal: 20,
        paddingVertical: 14,
        fontSize: 16,
        marginRight: 12
    },
    sendButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
