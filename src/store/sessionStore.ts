import { create } from 'zustand';
import { Session, SessionStep, UserSessionProgress } from '../models/Session';
import { sessionService } from '../services/sessionService';
import { playerService } from '../services/playerService';

interface SessionState {
    currentSession: Session | null;
    currentStepIndex: number;
    progressSeconds: number;
    completedSteps: string[];
    isCompleted: boolean;
    isLoading: boolean;

    // Actions
    startSession: (session: Session, resumeData?: Partial<UserSessionProgress>) => Promise<void>;
    updateProgress: (seconds: number) => void;
    nextStep: () => Promise<void>;
    completeSession: () => Promise<void>;
    reset: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
    currentSession: null,
    currentStepIndex: 0,
    progressSeconds: 0,
    completedSteps: [],
    isCompleted: false,
    isLoading: false,

    startSession: async (session, resumeData) => {
        set({
            currentSession: session,
            currentStepIndex: resumeData?.currentStepIndex ?? 0,
            progressSeconds: resumeData?.progressSeconds ?? 0,
            completedSteps: resumeData?.completedSteps ?? [],
            isCompleted: false
        });

        // Notify backend
        try {
            await sessionService.startSession(session.id);
        } catch (e) {
            console.warn('Backend session start failed, continuing offline', e);
        }

        // Start audio
        const step = session.steps[get().currentStepIndex];
        if (step) {
            await playerService.playAudio(step.audioUrl, (status) => {
                if (status.didJustFinish) {
                    get().nextStep();
                }
            });
            if (resumeData?.progressSeconds) {
                await playerService.seek(resumeData.progressSeconds * 1000);
            }
        }
    },

    updateProgress: (seconds) => {
        set({ progressSeconds: Math.floor(seconds) });
    },

    nextStep: async () => {
        const { currentSession, currentStepIndex, completedSteps } = get();
        if (!currentSession) return;

        const currentStep = currentSession.steps[currentStepIndex];
        const newCompletedSteps = [...completedSteps, currentStep.id];

        try {
            await sessionService.completeStep(currentSession.id, currentStep.id);
        } catch (e) {
            console.warn('Backend step complete failed', e);
        }

        if (currentStepIndex + 1 < currentSession.steps.length) {
            const nextIndex = currentStepIndex + 1;
            set({
                currentStepIndex: nextIndex,
                progressSeconds: 0,
                completedSteps: newCompletedSteps
            });

            const nextStep = currentSession.steps[nextIndex];
            await playerService.playAudio(nextStep.audioUrl, (status) => {
                if (status.didJustFinish) {
                    get().nextStep();
                }
            });
        } else {
            await get().completeSession();
        }
    },

    completeSession: async () => {
        const { currentSession } = get();
        if (!currentSession) return;

        try {
            await sessionService.completeSession(currentSession.id);
        } catch (e) {
            console.warn('Backend session complete failed', e);
        }
        set({ isCompleted: true });
        await playerService.stopAudio();
    },

    reset: () => {
        set({
            currentSession: null,
            currentStepIndex: 0,
            progressSeconds: 0,
            completedSteps: [],
            isCompleted: false
        });
        playerService.stopAudio();
    }
}));
