/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Request, Message, Notification } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'user1',
    name: 'Ayesha Khan',
    email: 'ayesha@helphub.ai',
    location: 'Lahore, Pakistan',
    role: 'Helper',
    skills: ['React', 'UX Design', 'Mentoring'],
    interests: ['Education', 'Tech for Good'],
    trustScore: 100,
    contributions: 42,
    badges: ['Design Ally', 'Fast Responder'],
    avatar: 'https://picsum.photos/seed/ayesha/100/100'
  },
  {
    id: 'user2',
    name: 'Sara Noor',
    email: 'sara@helphub.ai',
    location: 'Karachi, Pakistan',
    role: 'Seeker',
    skills: ['Marketing'],
    interests: ['Startups'],
    trustScore: 85,
    contributions: 5,
    badges: ['Explorer'],
    avatar: 'https://picsum.photos/seed/sara/100/100'
  },
  {
    id: 'user3',
    name: 'Omar Farooq',
    email: 'omar@helphub.ai',
    location: 'Islamabad, Pakistan',
    role: 'Helper',
    skills: ['Web Development', 'Python', 'Interview Prep'],
    interests: ['Career Growth'],
    trustScore: 98,
    contributions: 28,
    badges: ['Code Master'],
    avatar: 'https://picsum.photos/seed/omar/100/100'
  }
];

export const MOCK_REQUESTS: Request[] = [
  {
    id: 'req1',
    title: 'Need mock interview support for internship applications',
    description: 'I am applying for several software engineering internships and would love to practice my technical interviewing skills with someone experienced.',
    category: 'Web Development',
    urgency: 'High',
    tags: ['Interview Prep', 'Software Engineering'],
    authorId: 'user2',
    location: 'Karachi',
    status: 'Open',
    createdAt: new Date().toISOString(),
    aiSummary: 'The user is seeking technical interview practice for engineering roles.',
    aiTags: ['Coding', 'Career Advice']
  },
  {
    id: 'req2',
    title: 'Landing page design feedback for non-profit',
    description: 'We are building a site for a local animal shelter and need a quick design review.',
    category: 'UX Design',
    urgency: 'Medium',
    tags: ['Design', 'Non-Profit'],
    authorId: 'user3',
    location: 'Islamabad',
    status: 'Solved',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    aiSummary: 'Request for constructive criticism on a charity landing page layout.',
    aiTags: ['UI/UX', 'Accessibility']
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    userId: 'user1',
    title: 'Request Solved',
    message: 'The landing page design request was marked as solved!',
    type: 'solved',
    read: false,
    timestamp: new Date().toISOString()
  },
  {
    id: 'n2',
    userId: 'user1',
    title: 'New Helper Matched',
    message: 'Omar Farooq is interested in helping with your request.',
    type: 'matched',
    read: true,
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];
