/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { User, Request, Notification, Message as MessageType } from '../types';

interface AppState {
  // Auth State
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;

  // Requests State
  requests: Request[];
  setRequests: (requests: Request[]) => void;
  activeRequest: Request | null;
  setActiveRequest: (request: Request | null) => void;

  // Social & Real-time
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  messages: MessageType[];
  addMessage: (message: MessageType) => void;

  // UI State
  activePage: string;
  setActivePage: (page: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // Defaults
  user: null,
  isAuthenticated: false,
  requests: [],
  activeRequest: null,
  notifications: [],
  messages: [],
  activePage: 'login',
  isLoading: false,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setRequests: (requests) => set({ requests }),
  setActiveRequest: (activeRequest) => set({ activeRequest }),
  setNotifications: (notifications) => set({ notifications }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setActivePage: (activePage) => set({ activePage }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
