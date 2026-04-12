import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../i18n/translations';

interface Session {
  id: string;
  user_id: string;
  focus_level: string;
  duration_seconds: number;
  completed: boolean;
  notes?: string;
  created_at: string;
}

interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  focus_level?: string;
  session_id?: string;
  mood?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface UserProgress {
  total_sessions: number;
  total_minutes: number;
  focus_10_sessions: number;
  focus_12_sessions: number;
  focus_15_sessions: number;
  streak_days: number;
  last_session_date?: string;
}

interface Statistics {
  total_sessions: number;
  total_minutes: number;
  streak_days: number;
  focus_levels: {
    '10': number;
    '12': number;
    '15': number;
  };
  journal_entries: number;
}

interface AppState {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  loadLanguage: () => Promise<void>;
  
  // Sessions
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSessions: () => Promise<void>;
  createSession: (data: Omit<Session, 'id' | 'user_id' | 'created_at'>) => Promise<Session | null>;
  
  // Journal
  journalEntries: JournalEntry[];
  fetchJournalEntries: () => Promise<void>;
  createJournalEntry: (data: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<JournalEntry | null>;
  updateJournalEntry: (id: string, data: Partial<JournalEntry>) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  
  // Progress
  statistics: Statistics | null;
  fetchStatistics: () => Promise<void>;
}

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  language: 'en',
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,
  journalEntries: [],
  statistics: null,
  
  // Language
  setLanguage: async (lang: Language) => {
    set({ language: lang });
    await AsyncStorage.setItem('gateway_language', lang);
  },
  
  loadLanguage: async () => {
    try {
      const savedLang = await AsyncStorage.getItem('gateway_language');
      if (savedLang && (savedLang === 'en' || savedLang === 'de')) {
        set({ language: savedLang as Language });
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  },
  
  // Sessions
  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/sessions`);
      if (!response.ok) throw new Error('Failed to fetch sessions');
      const data = await response.json();
      set({ sessions: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  createSession: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create session');
      const session = await response.json();
      set((state) => ({
        sessions: [session, ...state.sessions],
        isLoading: false,
      }));
      return session;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },
  
  // Journal
  fetchJournalEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/journal`);
      if (!response.ok) throw new Error('Failed to fetch journal entries');
      const data = await response.json();
      set({ journalEntries: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  createJournalEntry: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/journal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create journal entry');
      const entry = await response.json();
      set((state) => ({
        journalEntries: [entry, ...state.journalEntries],
        isLoading: false,
      }));
      return entry;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },
  
  updateJournalEntry: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/api/journal/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update journal entry');
      const updated = await response.json();
      set((state) => ({
        journalEntries: state.journalEntries.map((e) =>
          e.id === id ? updated : e
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  deleteJournalEntry: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/journal/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete journal entry');
      set((state) => ({
        journalEntries: state.journalEntries.filter((e) => e.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  // Statistics
  fetchStatistics: async () => {
    try {
      const response = await fetch(`${API_URL}/api/statistics`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      set({ statistics: data });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));
