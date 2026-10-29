// Temporarily paused until speech recognition is suitable for speaking practice.
// Keep authored content, adapters and saved sessions available for re-enabling.
export const SPEAKING_ENABLED: boolean = false;
export const skillEnabled = (skill: string) => SPEAKING_ENABLED || skill !== 'speaking';
