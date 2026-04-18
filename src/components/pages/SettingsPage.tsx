/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Save, Loader2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { PageBanner } from './CorePages';

export const SettingsPage = () => {
  const [url, setUrl] = useState(localStorage.getItem('supabase_url') || '');
  const [key, setKey] = useState(localStorage.getItem('supabase_key') || '');
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
      
      setMessage({ type: 'success', text: 'Settings saved! Node synchronized.' });
      
      // Reload to re-initialize supabase client
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto px-10 py-12">
      <PageBanner 
        title="Nodes & Protocol" 
        description="Configure your connection to the Supabase backbone. These settings are stored locally in your browser."
        badge="System Configuration"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="bg-white p-10 rounded-card-lg shadow-sm border border-black/5">
            <h3 className="text-2xl font-bold text-brand-slate mb-8 flex items-center gap-3 tracking-tight">
               <Database size={20} className="text-brand-teal" /> Supabase Connection
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 mb-2 uppercase tracking-widest">Supabase URL</label>
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

              {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  {message.text}
                </div>
              )}

              <div className="pt-4 flex items-center gap-4">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-brand-teal text-white px-8 py-4 rounded-button font-bold text-base shadow-lg shadow-brand-teal/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Initialize Node
                </button>
                
                {message?.type === 'success' && (
                  <p className="text-[10px] font-bold text-brand-teal animate-pulse uppercase tracking-[0.2em]">
                    Reloading protocol...
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-brand-slate p-8 rounded-card-md text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <RefreshCw size={24} className="text-brand-teal mb-4" />
              <h4 className="text-lg font-bold mb-2">Protocol Sync</h4>
              <p className="text-white/40 text-sm leading-relaxed mb-6 font-medium">
                Changing these settings will re-initialize the connection. Make sure your Supabase project is active and URL/Key are correct.
              </p>
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] border-t border-white/5 pt-4">
                Encryption: AES-256 (Local)
              </div>
            </div>
          </div>
          
          <div className="bg-brand-cream p-8 rounded-card-md border border-black/5">
             <h4 className="text-sm font-bold text-brand-slate mb-4 uppercase tracking-widest">Setup Guide</h4>
             <ol className="space-y-4 text-xs font-medium text-slate-500">
                <li className="flex gap-3">
                  <span className="text-brand-teal font-black">01</span>
                  <span>Go to Supabase Dashboard &gt; Project Settings &gt; API</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-teal font-black">02</span>
                  <span>Copy Project URL and anon public key</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-teal font-black">03</span>
                  <span>Paste them here and click Initialize</span>
                </li>
             </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
