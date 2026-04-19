/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Save, Loader2, AlertCircle, CheckCircle2, RefreshCw, Key } from 'lucide-react';
import { PageBanner } from './CorePages';

export const SettingsPage = () => {
  const [url, setUrl] = useState(localStorage.getItem('supabase_url') || '');
  const [key, setKey] = useState(localStorage.getItem('supabase_key') || '');
  const [aiKey, setAiKey] = useState(localStorage.getItem('gemini_key') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    setMessage(null);
    
    try {
      if (url) localStorage.setItem('supabase_url', url.trim());
      else localStorage.removeItem('supabase_url');
      
      if (key) localStorage.setItem('supabase_key', key.trim());
      else localStorage.removeItem('supabase_key');

      if (aiKey) localStorage.setItem('gemini_key', aiKey.trim());
      else localStorage.removeItem('gemini_key');
      
      setMessage({ type: 'success', text: 'Protocol initialized. Neural sync in progress.' });
      
      // Reload to re-initialize clients
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to synchronize local protocol.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto px-10 py-12">
      <PageBanner 
        title="Protocol Settings" 
        description="Configure your connection to the community backbone and intelligence nodes. Settings are stored locally."
        badge="System Internals"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-10 rounded-card-lg shadow-sm border border-black/5">
            <h3 className="text-2xl font-bold text-brand-slate mb-8 flex items-center gap-3 tracking-tight">
               <Database size={20} className="text-brand-teal" /> Supabase Connection
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 mb-2 uppercase tracking-widest">Project URL</label>
                <input 
                  type="text" 
                  placeholder="https://your-project.supabase.co"
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-brand-cream rounded-xl px-5 py-3 outline-none font-bold text-base border border-transparent focus:border-brand-teal transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 mb-2 uppercase tracking-widest">Anon Public Key</label>
                <input 
                  type="password" 
                  placeholder="your-anon-key"
                  value={key} 
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full bg-brand-cream rounded-xl px-5 py-3 outline-none font-bold text-base border border-transparent focus:border-brand-teal transition-all" 
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-10 rounded-card-lg shadow-sm border border-black/5">
            <h3 className="text-2xl font-bold text-brand-slate mb-8 flex items-center gap-3 tracking-tight">
               <Key size={20} className="text-brand-teal" /> Gemini Intelligence
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 mb-2 uppercase tracking-widest">Gemini API Key</label>
                <input 
                  type="password" 
                  placeholder="AIza..."
                  value={aiKey} 
                  onChange={(e) => setAiKey(e.target.value)}
                  className="w-full bg-brand-cream rounded-xl px-5 py-3 outline-none font-bold text-base border border-transparent focus:border-brand-teal transition-all" 
                />
              </div>
              
              <p className="text-[10px] text-slate-400 font-medium italic">
                Get your key at <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-teal underline">Google AI Studio</a>.
              </p>
            </div>
          </section>

          <div className="flex flex-col gap-4">
              {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  {message.text}
                </div>
              )}

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-brand-teal text-white py-5 rounded-button font-black text-lg shadow-xl shadow-brand-teal/20 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                Synchronize All Nodes
              </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-brand-slate p-8 rounded-card-md text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <RefreshCw size={24} className="text-brand-teal mb-4" />
              <h4 className="text-lg font-bold mb-2">Protocol Sync</h4>
              <p className="text-white/40 text-sm leading-relaxed mb-6 font-medium">
                Settings are stored in your <strong>browser session only</strong>. This does not modify your project files.
              </p>
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] border-t border-white/5 pt-4">
                Node Identity: HELP-HUB-CLIENT
              </div>
            </div>
          </div>
          
          <div className="bg-brand-cream p-8 rounded-card-md border border-black/5">
             <h4 className="text-sm font-bold text-brand-slate mb-4 uppercase tracking-widest">Intelligence Check</h4>
             <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                If the top banner remains RED, double-check your API keys. New project keys may take a few minutes to propagate across the community backbone.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
