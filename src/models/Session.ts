export interface SessionStep {
    id: string;
    title: string;
    audioUrl: string;
    duration: number; // in seconds
    order: number;
}

export interface Session {
    id: string;
    title: string;
    description?: string;
    steps: SessionStep[];
    totalDuration: number; // in seconds
}

export interface UserSessionProgress {
    userId: string;
    sessionId: string;
    currentStepIndex: number;
    progressSeconds: number;
    completedSteps: string[]; // step IDs
    isCompleted: boolean;
}
