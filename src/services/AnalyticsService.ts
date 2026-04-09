import axios from 'axios';
import { TokenService } from './TokenService';

const API_URL = 'http://localhost:3000'; // Should be config based

export const analyticsService = {
    async getMoodHistory() {
        const token = await TokenService.getToken();
        return axios.get(`${API_URL}/mood/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async getInsights() {
        const token = await TokenService.getToken();
        return axios.get(`${API_URL}/analytics/insights`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    getMoodColor(mood: string | number) {
        const colors: Record<string, string> = {
            '5': '#FFD700',
            '4': '#87CEEB',
            '3': '#B0C4DE',
            '2': '#4682B4',
            '1': '#F4A460',
        };
        return colors[String(mood)] || '#B0C4DE';
    }
};
