/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Request as RequestType, User as UserType } from '../types';

/**
 * RE-BUILDING FOR SUPABASE
 * Table Schema Requirements:
 * 1. users: id (uuid), uid (text), name (text), email (text), avatar (text), location (text), trustScore (int), role (text), skills (text[]), interests (text[]), contributions (int), badges (text[]), createdAt (timestamptz)
 * 2. requests: id (uuid), authorId (text), title (text), description (text), category (text), urgency (text), status (text), aiSummary (text), aiTags (text[]), location (text), helperIds (text[]), createdAt (timestamptz)
 * 3. notifications: id (uuid), userId (text), title (text), message (text), type (text), read (boolean), timestamp (timestamptz)
 * 4. messages: id (uuid), channelId (text), senderId (text), text (text), timestamp (timestamptz)
 */

export const dbService = {
  // --- Requests ---
  async createRequest(requestData: Partial<RequestType>) {
    const { data, error } = await supabase
      .from('requests')
      .insert({
        ...requestData,
        status: 'Open',
        createdAt: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      if (error.code === '42P01') {
        throw new Error('The "requests" table is missing in your Supabase database.');
      }
      throw error;
    }
    
    return data?.id || 'temp-id';
  },

  async updateRequest(requestId: string, updates: Partial<RequestType>) {
    const { error } = await supabase
      .from('requests')
      .update(updates)
      .eq('id', requestId);

    if (error) throw error;
  },

  subscribeToRequests(callback: (requests: RequestType[]) => void) {
    // Initial fetch
    supabase
      .from('requests')
      .select('*')
      .order('createdAt', { ascending: false })
      .then(({ data }) => {
        if (data) callback(data as RequestType[]);
      });

    // Sub
    const channel = supabase
      .channel('requests-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, () => {
        supabase
          .from('requests')
          .select('*')
          .order('createdAt', { ascending: false })
          .then(({ data }) => {
            if (data) callback(data as RequestType[]);
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // --- Profile ---
  async saveProfile(uid: string, profile: Partial<UserType>) {
    const { error } = await supabase
      .from('users')
      .upsert({ ...profile, uid }, { onConflict: 'uid' });

    if (error) throw error;
  },

  async getProfile(uid: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'no rows found'
    return data as UserType || null;
  },

  calculateTrustScore(contributions: number, badgesCount: number) {
    return (contributions * 10) + (badgesCount * 50);
  },

  async incrementUserContribution(uid: string) {
    const user = await this.getProfile(uid);
    if (user) {
      const newContributions = (user.contributions || 0) + 1;
      const newScore = this.calculateTrustScore(newContributions, (user.badges || []).length);
      await this.saveProfile(uid, { 
        contributions: newContributions,
        trustScore: newScore 
      });
    }
  },

  // --- Leaderboard ---
  subscribeToLeaderboard(callback: (users: UserType[]) => void) {
    supabase
      .from('users')
      .select('*')
      .gt('trustScore', 0)
      .order('trustScore', { ascending: false })
      .then(({ data }) => {
        if (data) callback(data as UserType[]);
      });

    const channel = supabase
      .channel('leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        supabase
          .from('users')
          .select('*')
          .gt('trustScore', 0)
          .order('trustScore', { ascending: false })
          .then(({ data }) => {
            if (data) callback(data as UserType[]);
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // --- Interactions ---
  async volunteerForRequest(requestId: string, userId: string, helperIds: string[] = []) {
    const newHelpers = [...new Set([...helperIds, userId])];
    await this.updateRequest(requestId, { 
      helperIds: newHelpers,
      status: 'Processing' 
    });
  },

  async markAsSolved(requestId: string) {
    await this.updateRequest(requestId, { status: 'Solved' });
  },

  // --- Notifications ---
  async createNotification(notification: any) {
    const { error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        read: false,
        timestamp: new Date().toISOString()
      });

    if (error) throw error;
  },

  subscribeToNotifications(userId: string, callback: (notifications: any[]) => void) {
    supabase
      .from('notifications')
      .select('*')
      .eq('userId', userId)
      .order('timestamp', { ascending: false })
      .then(({ data }) => {
        if (data) callback(data);
      });

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications',
        filter: `userId=eq.${userId}`
      }, () => {
        supabase
          .from('notifications')
          .select('*')
          .eq('userId', userId)
          .order('timestamp', { ascending: false })
          .then(({ data }) => {
            if (data) callback(data);
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // --- Messaging (New) ---
  async sendMessage(channelId: string, senderId: string, text: string) {
    const { error } = await supabase
      .from('messages')
      .insert({
        channelId,
        senderId,
        text,
        timestamp: new Date().toISOString()
      });
    
    if (error) throw error;
  },

  subscribeToMessages(channelId: string, callback: (messages: any[]) => void) {
    supabase
      .from('messages')
      .select('*')
      .eq('channelId', channelId)
      .order('timestamp', { ascending: true })
      .then(({ data }) => {
        if (data) callback(data);
      });

    const channel = supabase
      .channel(`messages-${channelId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `channelId=eq.${channelId}`
      }, (payload) => {
        // Optimistic refresh
        supabase
          .from('messages')
          .select('*')
          .eq('channelId', channelId)
          .order('timestamp', { ascending: true })
          .then(({ data }) => {
            if (data) callback(data);
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
