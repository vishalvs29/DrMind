import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'userToken';

export class TokenService {
    static async getToken(): Promise<string | null> {
        return AsyncStorage.getItem(TOKEN_KEY);
    }

    static async setToken(token: string): Promise<void> {
        return AsyncStorage.setItem(TOKEN_KEY, token);
    }

    static async clearToken(): Promise<void> {
        return AsyncStorage.removeItem(TOKEN_KEY);
    }
}
