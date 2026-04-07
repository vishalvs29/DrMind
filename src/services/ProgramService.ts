export interface ProgramSession {
    id: string;
    title: string;
    duration: string;
    isCompleted: boolean;
    isLocked: boolean;
    day: number;
}

export interface Program {
    id: string;
    title: string;
    description: string;
    category: 'Student' | 'Corporate' | 'Police/Military';
    durationDays: number;
    sessions: ProgramSession[];
    progress: number; // 0 to 1
}

const generateSessions = (days: number): ProgramSession[] => {
    return Array.from({ length: days }, (_, i) => ({
        id: `session-${i + 1}`,
        title: `Day ${i + 1}: ${i === 0 ? 'Introduction' : 'Deepening Practice'}`,
        duration: '10 min',
        isCompleted: false,
        isLocked: i > 0, // Lock all but first
        day: i + 1,
    }));
};

export const PROGRAMS: Program[] = [
    {
        id: 'student-anxiety',
        title: 'Exam Anxiety Relief',
        description: 'Manage stress and improve focus during exam seasons.',
        category: 'Student',
        durationDays: 21,
        progress: 0.05,
        sessions: generateSessions(21),
    },
    {
        id: 'corp-burnout',
        title: 'Burnout Recovery',
        description: 'Reclaim your energy and mental space after high stress.',
        category: 'Corporate',
        durationDays: 21,
        progress: 0,
        sessions: generateSessions(21),
    },
    {
        id: 'mil-trauma',
        title: 'Trauma-Safe Respair',
        description: 'Stabilize and recover with PTSD-safe grounding.',
        category: 'Police/Military',
        durationDays: 21,
        progress: 0,
        sessions: generateSessions(21),
    },
];

class ProgramService {
    private programs: Program[] = PROGRAMS;

    getPrograms() {
        return this.programs;
    }

    getProgramById(id: string) {
        return this.programs.find(p => p.id === id);
    }

    completeSession(programId: string, sessionId: string) {
        const program = this.getProgramById(programId);
        if (!program) return;

        const sessionIndex = program.sessions.findIndex(s => s.id === sessionId);
        if (sessionIndex === -1) return;

        program.sessions[sessionIndex].isCompleted = true;

        // Unlock next session
        if (sessionIndex + 1 < program.sessions.length) {
            program.sessions[sessionIndex + 1].isLocked = false;
        }

        // Update progress
        const completedCount = program.sessions.filter(s => s.isCompleted).length;
        program.progress = completedCount / program.sessions.length;
    }
}

export const programService = new ProgramService();
