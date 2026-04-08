import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000'; // Should be config based

export const moodService = {
    async logMood(level: number, note?: string) {
        const token = await AsyncStorage.getItem('userToken');
        return axios.post(`${API_URL}/mood`, { level, note }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async getHistory() {
        const token = await AsyncStorage.getItem('userToken');
        return axios.get(`${API_URL}/mood/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};
