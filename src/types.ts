/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'Helper' | 'Seeker' | 'Admin';
export type Urgency = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'Open' | 'Processing' | 'Solved' | 'Archived';

export interface User {
  id: string;
  uid?: string;
  name: string;
  email: string;
  location: string;
  role: Role;
  skills: string[];
  interests: string[];
  trustScore: number;
  contributions: number;
  badges: string[];
  avatar: string;
}

export interface Request {
  id: string;
  authorId: string;
  title: string;
  description: string;
  category: string;
  urgency: Urgency;
  tags?: string[];
  location: string;
  status: Status;
  createdAt: any;
  aiSummary: string;
  aiTags: string[];
  helperIds?: string[];
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'solved' | 'matched' | 'system' | 'message';
  read: boolean;
  timestamp: string;
}

export interface AppState {
  currentUser: User | null;
  requests: Request[];
  messages: Message[];
  notifications: Notification[];
  users: User[];
}
