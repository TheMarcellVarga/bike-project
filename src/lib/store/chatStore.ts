import { create } from 'zustand';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatStore {
  messages: Message[];
  addMessage: (content: string, role: 'user' | 'assistant' | 'system') => void;
  clearChat: () => void;
  getMessagesForApi: () => ChatMessage[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  addMessage: (content, role) => 
    set((state) => ({
      messages: [...state.messages, {
        id: Math.random().toString(36).substring(7),
        content,
        role,
        timestamp: new Date()
      }]
    })),
  clearChat: () => set({ messages: [] }),
  getMessagesForApi: () => get().messages.map(({ content, role }) => ({ content, role }))
})); 