/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User as UserIcon, MapPin, Trophy, CheckCircle2, Star, Target, Zap, Loader2 } from 'lucide-react';
import { User } from '../../types';
import { PageBanner } from './CorePages';
import { dbService } from '../../services/dbService';

export const ProfilePage = ({ user, setUser }: any) => {
  const profileUser = user || {
    name: 'Anonymous Member',
    location: 'Unknown',
    trustScore: 0,
    contributions: 0,
    skills: [],
    badges: [],
    interests: [],
    avatar: 'https://picsum.photos/seed/anon/100/100'
  };

  const [name, setName] = useState(profileUser.name);
  const [location, setLocation] = useState(profileUser.location);
  const [skills, setSkills] = useState(profileUser.skills.join(', '));
  const [interests, setInterests] = useState(profileUser.interests.join(', '));
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updatedProfile: Partial<User> = {
        name,
        location,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: interests.split(',').map(i => i.trim()).filter(Boolean),
      };
      
      await dbService.saveProfile(user.id, { ...user, ...updatedProfile });
      setUser({ ...user, ...updatedProfile });
      alert("Profile synchronized with community layer.");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to sync profile. Check connection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto px-10 py-12">
      <PageBanner 
        title={profileUser.name} 
        description={`${profileUser.location} • Verified Community Contributor Since 2024`}
        badge="Personal Identity"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        <aside className="space-y-6">
          <div className="bg-white p-8 rounded-card-md shadow-sm border border-black/5 text-center transition-all group">
            <div className="relative inline-block mb-6">
                <img src={profileUser.avatar} className="w-32 h-32 rounded-3xl mx-auto border-4 border-brand-cream shadow-sm" referrerPolicy="no-referrer" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-teal rounded-xl border-2 border-white flex items-center justify-center text-white shadow-sm">
                    <CheckCircle2 size={14} />
                </div>
            </div>
            <h3 className="text-xl font-bold text-brand-slate tracking-tight mb-1">{profileUser.name}</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-6 italic">{profileUser.email}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-brand-cream/50 p-4 rounded-xl border border-black/5 text-center">
                    <p className="text-2xl font-bold text-brand-teal leading-none mb-1">{profileUser.trustScore}%</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trust</p>
                </div>
                <div className="bg-brand-cream/50 p-4 rounded-xl border border-black/5 text-center">
                    <p className="text-2xl font-bold text-brand-slate leading-none mb-1">{profileUser.contributions}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Solved</p>
                </div>
            </div>

            <div className="space-y-6 text-left">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Merit & Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                    {profileUser.skills.map((s: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-brand-slate text-white text-[10px] font-bold rounded-lg">{s}</span>
                    ))}
                    </div>
                </div>
            </div>
          </div>
          
          <div className="bg-brand-slate p-8 rounded-card-md text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <Trophy size={24} className="text-brand-teal mb-4" />
                <h4 className="text-lg font-bold mb-2">Ecosystem Badges</h4>
                <div className="space-y-3">
                    {profileUser.badges && profileUser.badges.length > 0 ? profileUser.badges.map((b: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                             <span className="text-xs font-bold text-white/80">{b}</span>
                        </div>
                    )) : (
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">No merit badges issued yet.</p>
                    )}
                </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          </div>
        </aside>

        <section className="bg-white p-10 rounded-card-lg shadow-sm border border-black/5">
          <h3 className="text-2xl font-bold text-brand-slate mb-8 flex items-center gap-3 tracking-tight">
             <UserIcon size={20} className="text-brand-teal" /> Profile Configuration
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-extrabold text-slate-400 mb-2 uppercase tracking-widest">Full merit name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-brand-cream rounded-xl px-5 py-3 outline-none font-bold text-base border border-transparent focus:border-brand-teal transition-all" 
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-extrabold text-slate-400 mb-2 uppercase tracking-widest">Primary Location</label>
              <input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-brand-cream rounded-xl px-5 py-3 outline-none font-bold text-base border border-transparent focus:border-brand-teal transition-all" 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-extrabold text-slate-400 mb-2 uppercase tracking-widest">Skill Keywords (comma separated)</label>
              <input 
                type="text" 
                value={skills} 
                onChange={(e) => setSkills(e.target.value)}
                className="w-full bg-brand-cream rounded-xl px-5 py-3 outline-none font-bold text-base border border-transparent focus:border-brand-teal transition-all" 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-extrabold text-slate-400 mb-2 uppercase tracking-widest">Contribution Interests</label>
              <textarea 
                rows={4} 
                value={interests} 
                onChange={(e) => setInterests(e.target.value)}
                className="w-full bg-brand-cream rounded-2xl px-5 py-4 outline-none font-medium text-base border border-transparent focus:border-brand-teal transition-all resize-none"
              ></textarea>
            </div>
            <div className="col-span-2 pt-6">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-brand-teal text-white px-[40px] py-4 rounded-button font-bold text-base shadow-lg shadow-brand-teal/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : null}
                Save global profile
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
