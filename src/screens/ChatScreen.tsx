import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Send, ShieldAlert, Heart } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Card } from '../components/Card';
import { Typography } from '../components/Typography';
import { CrisisResponseModal } from '../components/CrisisResponseModal';
import { processChatMessage, getLocalHelplines, Message, RiskLevel } from '../services/CrisisService';

export const ChatScreen = () => {
    const { theme } = useTheme();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm DrMindit, your empathetic mental health companion. How are you feeling today?",
            sender: 'ai',
            timestamp: new Date(),
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isCrisisModalVisible, setCrisisModalVisible] = useState(false);
    const [currentRisk, setCurrentRisk] = useState<RiskLevel>('LOW');
    const flatListRef = useRef<FlatList>(null);

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

        const { response, risk, emotion } = await processChatMessage(userMessage.text);
        setCurrentRisk(risk);

        if (risk === 'HIGH' || risk === 'CRITICAL') {
            setCrisisModalVisible(true);
        }

        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: response,
            sender: 'ai',
            timestamp: new Date(),
            isCrisis: risk !== 'LOW',
            emotion: emotion
        };

        setTimeout(() => {
            setMessages(prev => [...prev, aiMessage]);
        }, 800);
    };

    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 200);
    }, [messages]);

    const helplines = getLocalHelplines('US');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Typography variant="h2">Empathetic Support</Typography>
                        <View style={[styles.activeIndicator, { backgroundColor: '#10B981' }]} />
                    </View>
                    <Typography variant="caption" style={{ color: theme.textSecondary }}>
                        Deep Context Understanding Active
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
                                <Typography variant="caption" style={{ color: '#6366F1', fontWeight: '700' }}>
                                    {item.emotion}
                                </Typography>
                            </View>
                        )}
                        <Card
                            variant={item.sender === 'user' ? 'high' : 'lowest'}
                            style={[
                                styles.messageCard,
                                item.sender === 'user' ? styles.userCard : styles.aiCard,
                                item.isCrisis && { borderColor: '#EF4444', borderWidth: 1.5 }
                            ]}
                        >
                            <Typography
                                variant="body"
                                style={{ color: item.sender === 'user' ? '#FFF' : theme.text, lineHeight: 22 }}
                            >
                                {item.text}
                            </Typography>
                        </Card>
                    </View>
                )}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={[styles.inputArea, { borderTopColor: theme.border }]}>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
                        placeholder="How are you feeling deep down?"
                        placeholderTextColor={theme.textSecondary}
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
                riskLevel={currentRisk === 'CRITICAL' ? 'CRITICAL' : 'HIGH'}
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
    activeIndicator: { width: 6, height: 6, borderRadius: 3, marginLeft: 8 },
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
        justifyContent: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4
    }
});
