/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrainCircuit, MessageSquare, Trophy, Bell, CheckCircle2, AlertCircle, ArrowUpRight, TrendingUp, Search, Activity, Zap, Target, Send, Loader2 } from 'lucide-react';
import { User, Request, Notification, Message as MessageType } from '../../types';
import { PageBanner } from './CorePages';
import { dbService } from '../../services/dbService';
import { useStore } from '../../store/useStore';

// --- AICenterPage ---
export const AICenterPage = ({ requests, setSelectedRequestId, setActivePage }: any) => {
  const openRequests = requests.filter((r: Request) => r.status === 'Open');
  const criticalRequests = openRequests.filter((r: Request) => r.urgency === 'Critical');

  return (
    <div className="max-w-[1024px] mx-auto px-10 py-12">
      <PageBanner 
        title="Neural Signal Center." 
        description="Gemini-powered clusters identifying peak community needs and mission-critical signals."
        badge="Platform Intelligence"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div className="bg-brand-slate p-8 rounded-card-lg text-white shadow-xl relative overflow-hidden">
            <h3 className="text-3xl font-bold mb-2 tracking-tight">{openRequests.length}</h3>
            <p className="text-white/40 text-[11px] font-extrabold uppercase tracking-widest mb-6">Active Signals</p>
            <div className="flex items-center gap-2 text-brand-teal text-sm font-bold">
               <Activity size={16} /> Live Data
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         </div>
         <div className="bg-white p-8 rounded-card-lg border border-black/5 shadow-sm">
            <h3 className="text-3xl font-bold mb-2 tracking-tight text-brand-slate">{criticalRequests.length}</h3>
            <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest mb-6">Critical Interventions</p>
            <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
               <Zap size={16} /> Urgent Need
            </div>
         </div>
         <div className="bg-white p-8 rounded-card-lg border border-black/5 shadow-sm">
            <h3 className="text-3xl font-bold mb-2 tracking-tight text-brand-slate">98.2%</h3>
            <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest mb-6">Extraction Accuracy</p>
            <div className="flex items-center gap-2 text-brand-teal text-sm font-bold">
               <BrainCircuit size={16} /> Confidence
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-bold text-brand-slate">Priority Matching Clusters</h3>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Suggested Solves</span>
            </div>
            <div className="space-y-4">
               {criticalRequests.length > 0 ? (
                 criticalRequests.slice(0, 5).map(req => (
                   <div key={req.id} className="bg-white p-8 rounded-card-lg border border-black/5 hover:border-brand-teal/30 transition-all group flex items-start gap-6">
                      <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                         <Zap size={24} />
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{req.category}</span>
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none bg-red-50 px-2 py-1 rounded">Critical</span>
                         </div>
                         <h4 className="text-lg font-bold text-brand-slate mb-3 leading-tight group-hover:text-brand-teal transition-all">{req.title}</h4>
                         <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{req.aiSummary}</p>
                         <button 
                           onClick={() => { setSelectedRequestId(req.id); setActivePage('request-detail'); }}
                           className="text-xs font-bold text-brand-teal flex items-center gap-1 hover:gap-2 transition-all"
                         >
                            Analyze Mission <ArrowUpRight size={14} />
                         </button>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="p-20 bg-brand-cream/30 border border-dashed border-slate-200 rounded-card-lg text-center">
                    <Trophy size={42} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold italic text-sm">No critical signals at this moment.</p>
                 </div>
               )}
            </div>
         </div>

         <aside className="lg:col-span-4 space-y-6">
            <div className="bg-brand-slate p-8 rounded-card-lg text-white">
               <h4 className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-6">Community Optimization</h4>
               <ul className="space-y-6 text-sm">
                  <li className="flex gap-4">
                     <div className="w-1.5 h-1.5 bg-brand-teal rounded-full shrink-0 mt-1.5"></div>
                     <p className="text-white/70 leading-relaxed font-medium">Specific tags increase solver match probability by 40%.</p>
                  </li>
                  <li className="flex gap-4">
                     <div className="w-1.5 h-1.5 bg-brand-teal rounded-full shrink-0 mt-1.5"></div>
                     <p className="text-white/70 leading-relaxed font-medium">Regional hubs are becoming more active. Consider adding your Hub location.</p>
                  </li>
               </ul>
            </div>
         </aside>
      </div>
    </div>
  );
};

// --- MessagesPage ---
export const MessagesPage = ({ users }: any) => {
  const { user } = useStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!user || !selectedUser) return;
    const channelId = [user.id, selectedUser.id].sort().join('--');
    const cleanup = dbService.subscribeToMessages(channelId, (msgs) => setMessages(msgs));
    return () => cleanup();
  }, [user, selectedUser]);

  const handleSend = async () => {
    if (!user || !selectedUser || !inputText.trim() || isSending) return;
    setIsSending(true);
    const channelId = [user.id, selectedUser.id].sort().join('--');
    try {
      await dbService.sendMessage(channelId, user.id, inputText.trim());
      setInputText('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const otherUsers = users.filter((u: User) => u.id !== user?.id);

  return (
    <div className="max-w-[1024px] mx-auto px-10 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] bg-white rounded-card-lg border border-black/5 shadow-2xl h-[700px] overflow-hidden">
        <div className="border-r border-black/5 flex flex-col">
          <div className="p-8 border-b border-black/5">
            <h2 className="text-xl font-bold text-brand-slate underline decoration-brand-teal decoration-4 underline-offset-4">Transmissions</h2>
            <div className="mt-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                <input type="text" placeholder="Filter active nodes..." className="w-full bg-brand-cream border border-black/5 rounded-xl pl-9 py-2 text-xs font-bold outline-none focus:border-brand-teal transition-all" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-black/5">
            {otherUsers.map((u: User) => (
              <div 
                key={u.id} 
                onClick={() => setSelectedUser(u)}
                className={`p-6 hover:bg-brand-cream cursor-pointer transition-colors ${selectedUser?.id === u.id ? 'bg-brand-cream' : ''}`}
              >
                <div className="flex gap-4">
                  <img src={u.avatar} className="w-10 h-10 rounded-xl shadow-sm grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                  <div className="flex-1 truncate">
                    <div className="flex justify-between items-center mb-1">
                      <b className="text-sm text-brand-slate font-extrabold tracking-tight">{u.name}</b>
                      <span className="text-[10px] text-slate-400 font-black uppercase">Online</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 truncate leading-none">Trust Rank: {u.trustScore}%</p>
                  </div>
                </div>
              </div>
            ))}
            {otherUsers.length === 0 && (
              <div className="p-10 text-center opacity-40">
                <p className="text-xs font-bold uppercase tracking-widest">No nodes found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col bg-brand-cream/20">
          {selectedUser ? (
            <>
              <div className="p-8 bg-white border-b border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedUser.avatar} className="w-10 h-10 rounded-xl shadow-sm" referrerPolicy="no-referrer" />
                  <div>
                    <p className="font-extrabold text-brand-slate text-sm leading-tight">{selectedUser.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <p className="text-[9px] font-black text-brand-teal uppercase tracking-widest">Trust verified node</p>
                       {selectedUser.badges?.map(b => (
                         <span key={b} className="bg-brand-slate text-white text-[8px] font-bold px-1.5 py-0.5 rounded italic">#{b}</span>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-10 overflow-y-auto space-y-6 flex flex-col">
                {messages.length > 0 ? messages.map((m: any) => {
                  const isMe = m.senderId === user?.id;
                  return (
                    <div key={m.id} className={`flex gap-4 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                      {!isMe && <img src={selectedUser.avatar} className="w-8 h-8 rounded-lg mt-auto grayscale shadow-sm" referrerPolicy="no-referrer" />}
                      <div className={`${isMe ? 'bg-brand-slate text-white shadow-xl shadow-brand-slate/10' : 'bg-white text-slate-600 shadow-sm'} p-5 rounded-2xl border border-black/5 relative`}>
                        <p className="text-xs leading-relaxed font-medium">{m.text}</p>
                        <p className={`text-[8px] font-black uppercase mt-2 opacity-50 ${isMe ? 'text-right' : ''}`}>
                           {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300 opacity-50 space-y-4">
                     <MessageSquare size={48} />
                     <p className="text-xs font-bold uppercase tracking-widest italic">Encrypted Secure Line Established.</p>
                  </div>
                )}
              </div>

              <div className="p-8 bg-white border-t border-black/5 flex gap-4">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Broadcast message..." 
                  className="flex-1 bg-brand-cream border border-black/5 rounded-xl px-5 py-4 text-xs font-bold outline-none focus:border-brand-teal transition-all shadow-inner" 
                />
                <button 
                  onClick={handleSend}
                  disabled={isSending || !inputText.trim()}
                  className="bg-brand-teal text-white px-6 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-brand-teal/20 flex items-center justify-center disabled:opacity-50"
                >
                    {isSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 text-center px-10">
               <Zap size={48} className="mb-6 opacity-20 text-brand-teal" />
               <h3 className="text-xl font-bold text-brand-slate mb-2">Select a Pathfinder</h3>
               <p className="text-sm font-medium text-slate-400">Initiate a secure transmission node to coordinate mission support.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- LeaderboardPage ---
export const LeaderboardPage = ({ users }: any) => {
  return (
    <div className="max-w-[1024px] mx-auto px-10 py-12">
      <PageBanner 
        title="Top Pathfinders." 
        description="Celebrating the members who provide the highest quality support and contribution."
        badge="Community Trust"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-card-lg shadow-xl shadow-black/[0.02] border border-black/5 overflow-hidden w-full">
            <div className="p-8 border-b border-black/5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-brand-slate tracking-tight">Influence Rankings</h3>
              <div className="flex gap-2">
                  <span className="px-3 py-1 bg-brand-cream rounded-md text-[10px] font-bold uppercase text-slate-400">All Time</span>
              </div>
            </div>
            <div className="divide-y divide-black/[0.03]">
              {users.sort((a: User, b: User) => b.trustScore - a.trustScore).map((user: User, index: number) => (
                <div key={user.id} className="p-8 flex items-center justify-between group hover:bg-brand-cream/30 transition-colors">
                  <div className="flex items-center gap-6">
                    <span className={`text-2xl font-black ${index < 3 ? 'text-brand-teal' : 'text-slate-200'} w-8`}>#{index + 1}</span>
                    <div className="flex items-center gap-4">
                        <img src={user.avatar} className="w-12 h-12 rounded-xl shadow-sm grayscale group-hover:grayscale-0 transition-all border-2 border-transparent group-hover:border-brand-teal/20" referrerPolicy="no-referrer" />
                        <div>
                          <p className="font-bold text-brand-slate text-base leading-none mb-1">{user.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                            {user.badges?.map(b => (
                              <span key={b} className="text-[9px] font-black text-brand-teal uppercase italic">#{b}</span>
                            ))}
                          </div>
                        </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-brand-slate leading-none">{user.trustScore}</p>
                    <p className="text-[10px] font-extrabold text-brand-teal uppercase tracking-widest mt-1">Trust Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-brand-slate p-10 rounded-card-lg text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <Trophy size={40} className="text-brand-teal mb-8" />
                <h3 className="text-2xl font-bold mb-4 tracking-tight leading-tight">Contribution Rewards</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8 font-medium">Pathfinders receive early access to beta tools, premium mentoring opportunities, and limited-edition badges.</p>
                <button className="w-full bg-brand-teal text-white py-4 rounded-button font-bold text-base shadow-lg shadow-brand-teal/20 hover:opacity-90 transition-all">Level Up Manual</button>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal opacity-10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- NotificationsPage ---
export const NotificationsPage = ({ notifications }: any) => {
  return (
    <div className="max-w-[1024px] mx-auto px-10 py-12">
      <PageBanner 
        title="Intelligence Alerts." 
        description="Stay updated with community interventions and signal matches in real-time."
        badge="Notifications"
      />
      
      <div className="max-w-2xl bg-white rounded-card-lg shadow-sm border border-black/5 overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-black/5">
            {notifications.map((n: any) => (
              <div key={n.id} className={`p-8 flex gap-6 items-start hover:bg-brand-cream/30 transition-all ${!n.read ? 'bg-brand-teal/5' : ''}`}>
                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    n.type === 'solved' ? 'bg-green-100 text-green-600' : 
                    n.type === 'matched' ? 'bg-brand-teal text-white' : 
                    'bg-slate-100 text-slate-500'
                }`}>
                  {n.type === 'solved' ? <CheckCircle2 size={24} /> : 
                   n.type === 'matched' ? <Target size={24} /> : 
                   <Bell size={24} />}
                </div>
                <div className="flex-1">
                   <h4 className="font-bold text-brand-slate text-lg mb-1 leading-tight">{n.title}</h4>
                   <p className="text-sm text-slate-500 leading-relaxed mb-4 font-medium">{n.message}</p>
                   <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(n.timestamp?.toDate ? n.timestamp.toDate() : n.timestamp).toLocaleString()}</span>
                      {!n.read && <span className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-pulse"></span>}
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-24 text-center">
             <Bell size={48} className="mx-auto text-slate-200 mb-6" />
             <p className="text-slate-400 font-extrabold text-sm uppercase tracking-widest italic">No active alerts at this moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
