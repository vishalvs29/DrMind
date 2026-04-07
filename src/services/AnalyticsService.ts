export interface MoodEntry {
    date: string;
    mood: 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious';
    level: number; // 1-5
}

export interface AnalyticsData {
    moodHistory: MoodEntry[];
    stressLevel: 'Low' | 'Medium' | 'High';
    sessionMinutes: number;
    streakDays: number;
    riskStatus: 'Low' | 'Medium' | 'High';
}

const MOCK_DATA: AnalyticsData = {
    moodHistory: [
        { date: 'Mon', mood: 'happy', level: 5 },
        { date: 'Tue', mood: 'calm', level: 4 },
        { date: 'Wed', mood: 'neutral', level: 3 },
        { date: 'Thu', mood: 'anxious', level: 2 },
        { date: 'Fri', mood: 'neutral', level: 3 },
        { date: 'Sat', mood: 'calm', level: 4 },
        { date: 'Sun', mood: 'happy', level: 5 },
    ],
    stressLevel: 'Medium',
    sessionMinutes: 125,
    streakDays: 5,
    riskStatus: 'Low',
};

class AnalyticsService {
    getAnalytics(): AnalyticsData {
        return MOCK_DATA;
    }

    getMoodColor(mood: string): string {
        switch (mood) {
            case 'happy': return '#FFD700';
            case 'calm': return '#87CEEB';
            case 'neutral': return '#B0C4DE';
            case 'sad': return '#4682B4';
            case 'anxious': return '#F4A460';
            default: return '#CCC';
        }
    }
}

export const analyticsService = new AnalyticsService();
