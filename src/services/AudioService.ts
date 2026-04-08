import { Audio } from 'expo-av';

class AudioService {
    private sound: Audio.Sound | null = null;

    async load(uri: string, onStatusUpdate?: (status: any) => void) {
        if (this.sound) {
            await this.sound.unloadAsync();
        }

        const { sound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: false },
            onStatusUpdate
        );
        this.sound = sound;
    }

    async play() {
        if (this.sound) {
            await this.sound.playAsync();
        }
    }

    async pause() {
        if (this.sound) {
            await this.sound.pauseAsync();
        }
    }

    async stop() {
        if (this.sound) {
            await this.sound.stopAsync();
        }
    }

    async seek(positionMillis: number) {
        if (this.sound) {
            await this.sound.setPositionAsync(positionMillis);
        }
    }

    async seekRelative(offsetMillis: number) {
        if (this.sound) {
            const status: any = await this.sound.getStatusAsync();
            if (status.isLoaded) {
                const newPosition = Math.max(0, Math.min(status.durationMillis || 0, status.positionMillis + offsetMillis));
                await this.sound.setPositionAsync(newPosition);
            }
        }
    }

    async unload() {
        if (this.sound) {
            await this.sound.unloadAsync();
            this.sound = null;
        }
    }

    async setVolume(volume: number) {
        if (this.sound) {
            await this.sound.setVolumeAsync(volume);
        }
    }
}

export const audioService = new AudioService();
