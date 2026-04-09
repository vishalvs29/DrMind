import axios from 'axios';
import { TokenService } from './TokenService';

const API_URL = 'http://localhost:3000'; // Should be config based

export const moodService = {
    async logMood(level: number, note?: string) {
        const token = await TokenService.getToken();
        return axios.post(`${API_URL}/mood`, { level, note }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async getHistory() {
        const token = await TokenService.getToken();
        return axios.get(`${API_URL}/mood/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};
