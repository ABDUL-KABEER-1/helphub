/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Trophy, ArrowRight, ChevronRight, MessageSquare, Heart, Activity, Target, Zap, Clock } from 'lucide-react';
import { Request, User } from '../../types';
import { useStore } from '../../store/useStore';
import { useDashboardStats } from '../../hooks/useDashboardStats';

interface HomeProps {
  setActivePage: (p: string) => void;
  requests: Request[];
  setSelectedRequestId: (id: string) => void;
}

export const HomePage = ({ setActivePage, requests, setSelectedRequestId }: HomeProps) => {
  const { user } = useStore();
  const { totalRequests, totalHelped, recentActivity } = useDashboardStats(requests, user);

  if (user) {
    return (
      <div className="max-w-[1024px] mx-auto px-10 py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Dashboard Content */}
        <div className="flex flex-col gap-6">
          <div className="bg-brand-slate p-10 rounded-card-lg text-white">
            <h1 className="text-3xl font-bold mb-4 tracking-tight">Welcome back, {user.name.split(' ')[0]}.</h1>
            <p className="text-white/60 mb-8 max-w-lg">Your community impact has reached <b>{user.trustScore}% Trust</b>. {totalHelped > 0 ? `You've supported ${totalHelped} pathfinders recently.` : "Ready to provide some community signals today?"}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setActivePage('create-request')}
                className="bg-brand-teal px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-brand-teal/20"
              >
                New Help Request
              </button>
              <button 
                onClick={() => setActivePage('explore')}
                className="bg-white/10 border border-white/10 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-all"
              >
                Browse Signals
              </button>
            </div>
          </div>

          {/* Aggregated Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="bg-white p-6 rounded-card-md border border-black/5 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-brand-cream rounded-xl flex items-center justify-center text-brand-teal mb-3">
                  <Activity size={20} />
                </div>
                <span className="block text-2xl font-black text-brand-slate leading-none mb-1">{totalRequests}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requests</span>
             </div>
             <div className="bg-white p-6 rounded-card-md border border-black/5 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-brand-cream rounded-xl flex items-center justify-center text-brand-teal mb-3">
                  <Heart size={20} />
                </div>
                <span className="block text-2xl font-black text-brand-teal leading-none mb-1">{totalHelped}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Helped</span>
             </div>
             <div className="bg-white p-6 rounded-card-md border border-black/5 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-brand-cream rounded-xl flex items-center justify-center text-brand-teal mb-3">
                  <Trophy size={20} />
                </div>
                <span className="block text-2xl font-black text-brand-slate leading-none mb-1">{user.trustScore}%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust</span>
             </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-brand-slate">Personal Signals Hub</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</span>
             </div>
             <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((req) => (
                    <div 
                      key={req.id} 
                      onClick={() => { setSelectedRequestId(req.id); setActivePage('request-detail'); }}
                      className="bg-white p-5 rounded-card-md border border-black/5 hover:border-brand-teal/30 transition-all group cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-xl ${req.authorId === user.id ? 'bg-brand-slate text-white' : 'bg-brand-teal/10 text-brand-teal'}`}>
                            {req.authorId === user.id ? <Zap size={18} /> : <Heart size={18} />}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-brand-slate leading-tight mb-1 group-hover:text-brand-teal transition-colors line-clamp-1">{req.title}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{req.status} • {req.category}</p>
                         </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-teal transition-all" />
                    </div>
                  ))
                ) : (
                  <div className="p-12 bg-brand-cream/30 border border-dashed border-slate-200 rounded-card-md text-center">
                     <Zap size={32} className="mx-auto text-slate-200 mb-3" />
                     <p className="text-slate-400 text-sm font-bold italic">No active signals found in this region.</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
           <div className="bg-white p-8 rounded-card-md border border-black/5">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 underline decoration-brand-teal decoration-2 underline-offset-4">Community Pulse</h4>
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-cream border border-black/5 flex items-center justify-center shrink-0">
                       <Activity size={18} className="text-brand-teal" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-brand-slate mb-1">Ecosystem Status</p>
                       <p className="text-[11px] text-slate-500 leading-relaxed font-medium">94% of help requests found a solver within the first 2 hours today.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-cream border border-black/5 flex items-center justify-center shrink-0">
                       <Zap size={18} className="text-brand-teal" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-brand-slate mb-1">Local Network</p>
                       <p className="text-[11px] text-slate-500 leading-relaxed font-medium">14 new pathfinders recently established hubs in {user.location}.</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-brand-slate p-8 rounded-card-md text-white shadow-xl">
              <h4 className="text-lg font-bold mb-3 tracking-tight">Need Support?</h4>
              <p className="text-white/60 text-xs leading-relaxed mb-6 font-medium">Broadcast your signal to the network. Our AI assistant will automatically match you with the best community helpers.</p>
              <button 
                onClick={() => setActivePage('create-request')}
                className="w-full bg-brand-teal py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all font-mono tracking-tighter"
              >
                INITIATE_BROADCAST
              </button>
           </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="max-w-[1024px] mx-auto px-10 py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      {/* Left Column: Hero & Feed */}
      <div className="flex flex-col gap-6">
        <div className="bg-brand-slate p-10 rounded-card-lg text-white">
          <h1 className="text-[42px] leading-[1.1] font-bold mb-5 tracking-tight">Find help faster.<br />Become help that matters.</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setActivePage('explore')}
              className="bg-brand-teal px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
            >
              Open product demo
            </button>
            <button 
              onClick={() => setActivePage('create-request')}
              className="border border-white/20 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
            >
              Post a request
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-card-md shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-black/5">
            <span className="block text-2xl font-bold text-brand-teal">384+</span>
            <span className="text-[13px] text-slate-500 font-medium">Members Active</span>
          </div>
          <div className="bg-white p-5 rounded-card-md shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-black/5">
            <span className="block text-2xl font-bold text-brand-teal">72+</span>
            <span className="text-[13px] text-slate-500 font-medium">Requests Posted</span>
          </div>
          <div className="bg-white p-5 rounded-card-md shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-black/5">
            <span className="block text-2xl font-bold text-brand-teal">69+</span>
            <span className="text-[13px] text-slate-500 font-medium">Solved Cases</span>
          </div>
        </div>

        {/* Feed Section Header */}
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-xl font-bold text-brand-slate">Featured Requests</h2>
          <button 
            onClick={() => setActivePage('explore')}
            className="text-brand-teal text-sm font-semibold hover:underline transition-all"
          >
            View Feed →
          </button>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.slice(0, 4).map((req) => (
            <div key={req.id} className="bg-white p-5 rounded-card-md border border-black/5 hover:shadow-md transition-all group cursor-pointer" onClick={() => { setSelectedRequestId(req.id); setActivePage('request-detail'); }}>
              <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase mb-3 ${req.category === 'Web Development' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-900'}`}>{req.category}</span>
              <h4 className="text-base font-semibold text-brand-slate mb-2 line-clamp-2 leading-tight group-hover:text-brand-teal transition-colors">{req.title}</h4>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/5">
                <span className="text-xs font-medium text-slate-500">Member #{req.authorId.slice(-4)}</span>
                <span className={`text-xs font-bold ${req.urgency === 'High' ? 'text-emerald-600' : 'text-slate-400'}`}>Urgency: {req.urgency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Sidebar */}
      <div className="flex flex-col gap-5">
        <div className="bg-brand-slate text-white p-8 rounded-card-lg min-h-[410px]">
          <h3 className="text-[22px] font-bold mb-6 leading-tight">More than a form.<br />More like an ecosystem.</h3>
          <ul className="space-y-6">
            <li className="flex gap-3">
              <div className="w-4.5 h-4.5 bg-brand-teal rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <b className="block text-sm mb-1 leading-none">AI Request Intelligence</b>
                <p className="text-[13px] opacity-70 leading-relaxed">We analyze your problem to suggest the best solvers automatically.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="w-4.5 h-4.5 bg-brand-teal rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <b className="block text-sm mb-1 leading-none">Community Trust Graph</b>
                <p className="text-[13px] opacity-70 leading-relaxed">Reputation is built through real helpful interactions, not just votes.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="w-4.5 h-4.5 bg-brand-teal rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <b className="block text-sm mb-1 leading-none">Verified Outcomes</b>
                <p className="text-[13px] opacity-70 leading-relaxed">Every solved request contributes to a collective knowledge base.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-[#EBF7F5] border border-[#D1EBE7] p-6 rounded-card-md">
          <div className="flex items-center gap-2 text-brand-teal text-[11px] font-extrabold uppercase mb-3">
            <BrainCircuit size={14} />
            Platform Intelligence
          </div>
          <div className="text-[13px] leading-relaxed text-slate-600">
            Current high demand in <b className="text-brand-slate">React.js</b>. 14 mentors are currently online and ready to support new requests within 30 mins.
          </div>
        </div>
      </div>
    </div>
  );
};
