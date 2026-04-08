import { audioService } from './AudioService';

export const playerService = {
    async playAudio(url: string, onUpdate?: (status: any) => void) {
        await audioService.load(url, onUpdate);
        await audioService.play();
    },

    async pauseAudio() {
        await audioService.pause();
    },

    async stopAudio() {
        await audioService.stop();
        await audioService.unload();
    },

    async seek(positionMillis: number) {
        await audioService.seek(positionMillis);
    },

    async getStatus() {
        // This assumes AudioService provides a way to get status
        // For now, we'll return a placeholder or implement it in AudioService
        return {};
    }
};
