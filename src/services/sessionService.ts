import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSessionProgress } from '../models/Session';

const API_URL = 'http://127.0.0.1:3000'; // Target local backend

export const sessionService = {
    async startSession(sessionId: string) {
        const token = await AsyncStorage.getItem('userToken');
        return axios.post(`${API_URL}/session/start`, { sessionId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async saveProgress(progress: Partial<UserSessionProgress>) {
        const token = await AsyncStorage.getItem('userToken');
        return axios.post(`${API_URL}/session/progress`, progress, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async completeStep(sessionId: string, stepId: string) {
        const token = await AsyncStorage.getItem('userToken');
        return axios.post(`${API_URL}/session/step-complete`, { sessionId, stepId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async completeSession(sessionId: string) {
        const token = await AsyncStorage.getItem('userToken');
        return axios.post(`${API_URL}/session/complete`, { sessionId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async getResumeProgress() {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId'); // Assuming userId is stored
        return axios.get(`${API_URL}/session/progress/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};
