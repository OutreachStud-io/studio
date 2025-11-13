import {create} from 'zustand';

export type TTheme = 'light' | 'dark' | 'system';


interface AppState {
	theme: TTheme;
	selectedProjectId?: string;
	setTheme: (t: TTheme) => void;
	setSelectedProjectId: (projectId: string) => void;
}

export const useAppStore = create<AppState>(set => ({
	theme               : "system",
	selectedProjectId   : "cdc39c27-8e82-4107-a4c3-54c6b66fd327",
	setTheme            : (t: TTheme) => set(state => ({theme: t})),
	setSelectedProjectId: (projectId: string) => set(state => ({selectedProjectId: projectId})),
}));
