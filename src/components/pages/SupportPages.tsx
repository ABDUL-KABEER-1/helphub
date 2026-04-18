/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrainCircuit, CheckCircle2, AlertCircle, Share2, MessageSquare, ChevronRight, Trophy, Loader2 } from 'lucide-react';
import { Request, User } from '../../types';
import { PageBanner } from './CorePages';
import { analyzeHelpRequest, suggestImprovement } from '../../services/aiService';
import { dbService } from '../../services/dbService';
import { useStore } from '../../store/useStore';

// --- RequestDetailPage ---
export const RequestDetailPage = ({ requests, selectedRequestId, users }: any) => {
  const { user } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const req = requests.find((r: Request) => r.id === selectedRequestId);

  if (!req) return <div className="p-24 text-center text-xl font-bold">Request not found.</div>;

  const handleHelp = async () => {
    if (!user || isProcessing) return;
    setIsProcessing(true);
    try {
      await dbService.volunteerForRequest(req.id, user.id, req.helperIds);
      await dbService.createNotification({
        userId: req.authorId,
        title: 'New Pathfinder Found!',
        message: `${user.name} has volunteered to help with your signal: "${req.title}"`,
        type: 'matched'
      });
      alert("Succesfully joined as a pathfinder for this signal!");
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSolve = async () => {
    if (!user || isProcessing) return;
    setIsProcessing(true);
    try {
      await dbService.markAsSolved(req.id);
      
      // Reward all helpers who participated
      if (req.helperIds && req.helperIds.length > 0) {
        for (const helperId of req.helperIds) {
          await dbService.incrementUserContribution(helperId);
        }
      }

      await dbService.createNotification({
        userId: req.authorId,
        title: 'Mission Accomplished',
        message: `Your signal "${req.title}" has been marked as solved. +10 Trust awarded to your pathfinders.`,
        type: 'solved'
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const isAuthor = Boolean(user?.id && req.authorId && user.id === req.authorId);
  const alreadyHelping = Boolean(user?.id && req.helperIds?.includes(user.id));

  return (
    <div className="max-w-[1024px] mx-auto px-10 py-12">
      <div className="mb-10">
        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-brand-teal text-white text-[11px] font-bold uppercase tracking-widest rounded-md">{req.category}</span>
          <span className="px-3 py-1 bg-brand-slate text-white text-[11px] font-bold uppercase tracking-widest rounded-md">{req.urgency} Urgency</span>
          <span className={`px-3 py-1 text-white text-[11px] font-bold uppercase tracking-widest rounded-md ${req.status === 'Solved' ? 'bg-green-600' : 'bg-brand-slate'}`}>
            {req.status}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-brand-slate leading-tight max-w-4xl tracking-tight mb-2">{req.title}</h1>
        <p className="text-slate-500 font-medium text-sm">
            Posted in {req.location} • {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Just now'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-10 rounded-card-lg shadow-sm border border-black/5">
            <h3 className="text-xl font-bold text-brand-slate mb-6 flex items-center gap-2">
               Help Context
            </h3>
            <p className="text-slate-600 leading-relaxed text-base whitespace-pre-wrap">{req.description}</p>
          </div>

          <div className="bg-brand-slate p-10 rounded-card-lg text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <BrainCircuit className="text-brand-teal" size={24} />
                  <h3 className="text-xl font-bold">Platform Intelligence Summary</h3>
                </div>
                <div className="bg-white/5 p-6 rounded-card-md border border-white/10 mb-6 font-medium">
                    <p className="text-lg text-white/80 italic leading-relaxed mb-4">"{req.aiSummary}"</p>
                    <div className="flex flex-wrap gap-2">
                    {req.aiTags?.map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-brand-teal/20 border border-brand-teal/30 rounded-md text-[10px] font-bold text-brand-teal uppercase tracking-wider">#{tag}</span>
                    ))}
                    </div>
                </div>
                <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-none">Confidence Match: 98%</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal opacity-10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-card-md shadow-sm border border-black/5">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-6">Take Action</h4>
            <div className="space-y-3">
              {req.status !== 'Solved' && !isAuthor && (
                <button 
                  onClick={handleHelp}
                  disabled={alreadyHelping || isProcessing}
                  className="w-full bg-brand-teal text-white py-4 rounded-button font-bold text-base shadow-lg shadow-brand-teal/20 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {alreadyHelping ? 'Help Request Pending' : 'I can help'}
                </button>
              )}
              {req.status !== 'Solved' && isAuthor && (
                <button 
                  onClick={handleSolve}
                  disabled={isProcessing}
                  className="w-full bg-brand-teal text-white py-4 rounded-button font-bold text-base shadow-lg shadow-brand-teal/20 hover:opacity-90 transition-all"
                >
                  Mark as solved
                </button>
              )}
              {req.status === 'Solved' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-3">
                  <CheckCircle2 size={20} />
                  <span className="font-bold text-sm uppercase italic">Signal Resloved</span>
                </div>
              )}
              <button className="w-full border border-black/10 text-brand-slate py-4 rounded-button font-bold text-base hover:bg-brand-cream transition-all">Share signal</button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-card-md shadow-sm border border-black/5">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-6">Community Helpers</h4>
            <div className="space-y-6">
              {users.filter((u: User) => req.helperIds?.includes(u.id)).length > 0 ? (
                users.filter((u: User) => req.helperIds?.includes(u.id)).map((user: User) => (
                  <div key={user.id} className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative">
                      <img src={user.avatar} className="w-10 h-10 rounded-xl shadow-sm group-hover:scale-105 transition-all" referrerPolicy="no-referrer" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-teal rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle2 size={8} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-brand-slate text-sm group-hover:text-brand-teal transition-colors">{user.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trust {user.trustScore}%</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-medium italic">No pathfinders assigned yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};


// --- CreateRequestPage ---
export const CreateRequestPage = () => {
  const { user, setActivePage } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [urgency, setUrgency] = useState('Medium');
  const [manualTags, setManualTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [statusText, setStatusText] = useState('Ready for input');

  // Urgency Detection Shortcut
  const detectUrgency = (text: string) => {
    const urgentKeywords = ['urgent', 'emergency', 'now', 'asap', 'critical', 'immediate'];
    const lowerText = text.toLowerCase();
    if (urgentKeywords.some(keyword => lowerText.includes(keyword))) {
      setUrgency('High');
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setDescription(val);
    detectUrgency(val);
  };

  const handleRewrite = async () => {
    if (!description || isRewriting) return;
    setIsRewriting(true);
    setStatusText('Optimizing Signal with AI...');
    try {
      const optimized = await suggestImprovement(description);
      setDescription(optimized);
      setStatusText('Optimization Complete');
    } catch (e) {
      console.error(e);
      setStatusText('Rewrite failed');
    } finally {
      setIsRewriting(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !user) return;
    
    setIsSubmitting(true);
    setStatusText('Generating AI Intelligence...');
    
    try {
      // 1. AI Analysis & Signal Generation
      const intelligence = await analyzeHelpRequest(title, description);
      setStatusText('Syncing with Network...');

      // 2. Database Save (Includes Title, Description, Tags, Category, Urgency)
      const userManualTags = manualTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      const combinedTags = Array.from(new Set([...intelligence.tags, ...userManualTags]));

      await dbService.createRequest({
        authorId: user.id,
        title,
        description,
        category: intelligence.category || category,
        urgency: urgency as any,
        aiSummary: intelligence.summary,
        aiTags: combinedTags,
        location: user.location,
        status: 'Open'
      });

      setStatusText('Signal Published!');
      setTimeout(() => {
        setActivePage('explore');
      }, 1000);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || 'Error transmitting signal.';
      setStatusText(errorMessage.includes('not found') ? 'Network Table Missing' : 'Transmission Failure');
      setIsSubmitting(false);
      
      // If it's a specific "table not found" error, we should inform the user
      if (errorMessage.includes('relation "requests" does not exist')) {
        alert("The community database is not fully initialized. Please ensure the 'requests' table exists in Supabase.");
      } else {
        alert(`Signal Error: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto px-10 py-12">
      <PageBanner 
        title="Post a request." 
        description="Share what you need support with. AI will help structure your thoughts."
        badge="Create Context"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div className="bg-white p-10 rounded-card-lg shadow-sm border border-black/5">
          <div className="space-y-8">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Request Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Briefly state your problem..." 
                className="w-full bg-brand-cream border border-transparent focus:border-brand-teal rounded-xl px-5 py-4 outline-none font-bold text-lg transition-all" 
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Context & Details</label>
                <button 
                  onClick={handleRewrite}
                  disabled={isRewriting || !description}
                  className="flex items-center gap-1.5 text-[10px] font-black text-brand-teal uppercase hover:text-brand-slate transition-colors disabled:opacity-50"
                >
                  {isRewriting ? <Loader2 size={12} className="animate-spin" /> : <BrainCircuit size={12} />}
                  AI Rewrite & Optimize
                </button>
              </div>
              <textarea 
                rows={6} 
                value={description}
                onChange={handleDescriptionChange}
                placeholder="What exactly do you need help with?" 
                className="w-full bg-brand-cream border border-transparent focus:border-brand-teal rounded-2xl px-5 py-4 outline-none font-medium text-base transition-all resize-none shadow-inner"
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Category (AI Influenced)</label>
                <select 
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   className="w-full bg-brand-cream rounded-xl px-5 py-3 outline-none font-semibold text-brand-slate border border-transparent focus:border-brand-teal appearance-none"
                >
                  <option value="Technical">Technical</option>
                  <option value="Social">Social</option>
                  <option value="Physical">Physical</option>
                  <option value="Materials">Materials</option>
                  <option value="Mentorship">Mentorship</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Urgency</label>
                <select 
                   value={urgency}
                   onChange={(e) => setUrgency(e.target.value)}
                   className="w-full bg-brand-cream rounded-xl px-5 py-3 outline-none font-semibold text-brand-slate border border-transparent focus:border-brand-teal appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Manual Tags (AI will suggest others)</label>
              <input 
                type="text" 
                value={manualTags}
                onChange={(e) => setManualTags(e.target.value)}
                placeholder="React, CSS, Prototyping..." 
                className="w-full bg-brand-cream border border-transparent focus:border-brand-teal rounded-xl px-5 py-4 outline-none font-bold text-base transition-all" 
              />
            </div>
            <div className="pt-6">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || !title || !description}
                className="w-full bg-brand-teal text-white py-4 rounded-button font-bold text-lg shadow-xl shadow-brand-teal/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {statusText}
                  </>
                ) : 'Publish Request'}
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-[#EBF7F5] border border-[#D1EBE7] p-8 rounded-card-md">
            <div className="flex items-center gap-2 text-brand-teal text-[11px] font-extrabold uppercase mb-4">
              <BrainCircuit size={16} />
              Assistant Active
            </div>
            <div className="space-y-6">
              <div className="border-l-2 border-brand-teal pl-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</p>
                <p className="text-sm font-bold text-brand-slate">{statusText}</p>
              </div>
              <div className="bg-white/50 p-4 rounded-xl border border-brand-teal/10">
                <p className="text-[13px] leading-relaxed text-slate-600">
                  {isSubmitting 
                    ? "Our Gemini analysis engine is extracting core signal clusters and generating relevant intelligence tags for your request."
                    : "Our system is checking your description for clarity. Tip: Adding more specific tools can increase match accuracy."}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

