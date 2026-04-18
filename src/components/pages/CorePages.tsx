/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Filter, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Trophy, 
  MessageSquare, 
  Loader2, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Briefcase 
} from 'lucide-react';
import { User, Request, Notification, Message } from '../../types';
import { useFilteredRequests } from '../../hooks/useFilteredRequests';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

// Banner Component
export const PageBanner = ({ title, description, badge }: any) => (
  <div className="bg-brand-slate rounded-card-lg p-10 mb-6 text-white relative overflow-hidden shadow-2xl">
    <div className="relative z-10 max-w-2xl">
      {badge && <span className="inline-block px-3 py-1 bg-brand-teal text-[10px] font-bold uppercase tracking-widest rounded-md mb-4">{badge}</span>}
      <h1 className="text-4xl font-bold mb-4 tracking-tight leading-tight">{title}</h1>
      <p className="text-white/60 text-lg leading-relaxed max-w-xl">{description}</p>
    </div>
    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
  </div>
);

// --- LoginPage ---
export const LoginPage = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Helper' | 'Seeker'>('Seeker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError("Connection node offline. Check configuration.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role: role
            }
          }
        });
        if (signUpError) throw signUpError;
        
        if (data.user && data.session) {
          setSuccess("Account created successfully!");
        } else {
          setSuccess("Verification email sent! Please confirm to activate your node.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto px-10 py-12 flex items-center justify-center min-h-[80vh]">
      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-card-lg shadow-2xl overflow-hidden w-full border border-black/5">
        <div className="bg-brand-slate p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-8 leading-tight tracking-tight">Enter the<br/>support network.</h2>
            <ul className="space-y-6 max-w-xs text-sm">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-brand-teal flex-shrink-0 flex items-center justify-center text-white font-black">1</div>
                <p className="text-white/60">Secure, role-based entry for verified community members.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-brand-teal/20 flex-shrink-0 flex items-center justify-center text-brand-teal font-black">2</div>
                <p className="text-white/60">Instantly connect your existing trust score and contributions.</p>
              </li>
            </ul>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal opacity-10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        </div>
        
        <div className="p-12 flex flex-col justify-center bg-white relative">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-brand-slate mb-2">
              {mode === 'signup' ? 'Create Pathfinder Profile' : 'Access Signal Hub'}
            </h3>
            <p className="text-slate-500 text-sm">
              {mode === 'signup' ? 'Join the network to provide or receive support.' : 'Enter your credentials to synchronize nodes.'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[11px] font-black uppercase tracking-widest animate-shake">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-600 text-[11px] font-black uppercase tracking-widest animate-bounce">
                <CheckCircle2 size={14} />
                {success}
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-brand-cream border border-black/5 focus:border-brand-teal rounded-xl pl-12 pr-5 py-3.5 outline-none transition-all font-semibold text-brand-slate text-sm" 
                  />
                </div>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" size={16} />
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-brand-cream border border-black/5 focus:border-brand-teal rounded-xl pl-12 pr-5 py-3.5 outline-none transition-all font-semibold text-brand-slate text-sm appearance-none"
                  >
                    <option value="Seeker">Seeker (Needs help)</option>
                    <option value="Helper">Helper (Can provide help)</option>
                  </select>
                </div>
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" size={16} />
              <input 
                type="email" 
                placeholder="Email address" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-cream border border-black/5 focus:border-brand-teal rounded-xl pl-12 pr-5 py-3.5 outline-none transition-all font-semibold text-brand-slate text-sm" 
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" size={16} />
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-cream border border-black/5 focus:border-brand-teal rounded-xl pl-12 pr-5 py-3.5 outline-none transition-all font-semibold text-brand-slate text-sm" 
              />
            </div>
            
            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-brand-teal text-white py-4 rounded-button font-bold shadow-xl shadow-brand-teal/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'signup' ? 'Create Account' : 'Authenticate')}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-black/5 text-center">
            <button 
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-xs font-black text-brand-teal uppercase tracking-widest hover:text-brand-slate transition-colors block w-full mb-4"
            >
              {mode === 'signin' ? "Don't have a profile? Sign Up" : "Already registered? Sign In"}
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-black/5"></div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Or access simulation</span>
              <div className="h-px flex-1 bg-black/5"></div>
            </div>

            <button 
              onClick={async () => {
                setLoading(true);
                try {
                  // Attempt sign in with common demo credentials if they exist, 
                  // or just show a message. This is a helper for when rate limits hit.
                  setError("Email limits hit? To bypass: Go to Supabase > Auth > Providers > Email and disable 'Confirm email'.");
                } finally {
                  setLoading(false);
                }
              }}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-brand-teal transition-colors"
            >
              Learn to bypass verification limits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ExplorePage ---
export const ExplorePage = ({ requests, setSelectedRequestId, setActivePage }: any) => {
  const { 
    filters, 
    filteredRequests, 
    updateFilter, 
    resetFilters 
  } = useFilteredRequests(requests);

  return (
    <div className="max-w-[1024px] mx-auto px-10 py-12">
      <PageBanner 
        title="Explore help requests." 
        description="Filter by category, urgency, or context to find where you can make the most impact."
        badge="Community Feed"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-card-md shadow-sm border border-black/5 sticky top-28">
            <h3 className="text-lg font-bold text-brand-slate mb-6 flex items-center gap-2">
              <Filter size={16} className="text-brand-teal" /> Refine feed
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Search Signals</label>
                <input 
                  type="text" 
                  placeholder="Keywords or tags..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full bg-brand-cream rounded-xl px-4 py-3 text-sm font-semibold outline-none border border-transparent focus:border-brand-teal transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                <select 
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full bg-brand-cream rounded-xl px-4 py-3 text-sm font-semibold outline-none border border-transparent focus:border-brand-teal"
                >
                  <option value="All">All Categories</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Design">Design</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Operations">Operations</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Location Hub</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lahore, Karachi"
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  className="w-full bg-brand-cream rounded-xl px-4 py-3 text-sm font-semibold outline-none border border-transparent focus:border-brand-teal transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Urgency Level</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Low', 'Medium', 'High', 'Critical'].map(level => (
                    <button 
                      key={level} 
                      onClick={() => updateFilter('urgency', level)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors border uppercase ${
                        filters.urgency === level ? 'bg-brand-teal text-white border-brand-teal' : 'bg-brand-cream text-brand-slate border-black/5 hover:border-brand-teal'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={resetFilters}
              className="w-full mt-8 py-3 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-teal transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </aside>

        <section className="lg:col-span-3 space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req: Request) => (
              <div key={req.id} className="bg-white p-6 rounded-card-md border border-black/5 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start group">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${req.category === 'Web Development' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-900'}`}>{req.category}</span>
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-md ${req.urgency === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{req.urgency}</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-slate mb-2 group-hover:text-brand-teal transition-colors leading-tight">{req.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm line-clamp-2 mb-4">{req.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs pt-4 border-t border-black/5">
                    <div className="flex items-center gap-2">
                      <img src={`https://picsum.photos/seed/${req.authorId}/32/32`} className="w-6 h-6 rounded-lg grayscale group-hover:grayscale-0 transition-all shadow-sm" referrerPolicy="no-referrer" />
                      <span className="font-semibold text-brand-slate">Member #{req.authorId.slice(-4)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-medium text-[11px]">
                      <MapPin size={12} /> {req.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium font-mono text-[11px]">
                      <Clock size={14} /> {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="md:w-32 flex flex-col gap-2 shrink-0 self-stretch justify-center">
                  <button 
                    onClick={() => { setSelectedRequestId(req.id); setActivePage('request-detail'); }}
                    className="w-full py-3 bg-brand-cream text-brand-slate font-bold text-[13px] rounded-xl hover:bg-brand-teal hover:text-white transition-all shadow-sm"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-20 rounded-card-lg border border-dashed border-slate-200 text-center">
               <AlertCircle size={40} className="mx-auto text-slate-300 mb-4" />
               <h4 className="text-lg font-bold text-brand-slate mb-2">No signals found</h4>
               <p className="text-slate-500 text-sm">Try adjusting your filters to find more community needs.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
