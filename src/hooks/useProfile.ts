import { useState, useEffect } from 'react';
import axios from 'axios';
import { TokenService } from '../services/TokenService';

const API_URL = 'http://127.0.0.1:3000'; // Target local backend

export interface UserProfile {
    id: string;
    email: string;
    name: string | null;
    role: string;
    organization: string | null;
}

export const useProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const token = await TokenService.getToken();
            if (!token) {
                setError('No token found');
                return;
            }

            const response = await axios.get(`${API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch profile:', err);
            setError(err.message || 'Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return { profile, loading, error, refreshProfile: fetchProfile };
};
