/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ChevronRight, 
  BrainCircuit, 
  Target, 
  ShieldCheck, 
  MapPin, 
  Plus, 
  X,
  Loader2
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { dbService } from '../../services/dbService';
import { getOnboardingSuggestions } from '../../services/aiService';
import { Role } from '../../types';

export const OnboardingPage = () => {
  const { user, setUser, setActivePage } = useStore();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | ''>('');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<{ suggestedSkills: string[], suggestedInvolvedAreas: string[] } | null>(null);

  const handleNextStep = async () => {
    if (step === 2 && interests.length > 0) {
      setIsAnalyzing(true);
      const res = await getOnboardingSuggestions(interests);
      setSuggestions(res);
      setIsAnalyzing(false);
    }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      role: (role || 'Seeker') as Role,
      location: location || 'Global',
      interests,
      skills,
      trustScore: 10 // Bonus for completing onboarding
    };

    await dbService.saveProfile(user.id, updatedUser);
    setUser(updatedUser);
    setActivePage('home');
  };

  const addInterest = () => {
    if (interestInput && !interests.includes(interestInput)) {
      setInterests([...interests, interestInput]);
      setInterestInput('');
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const removeInterest = (item: string) => setInterests(interests.filter(i => i !== item));
  const removeSkill = (item: string) => setSkills(skills.filter(i => i !== item));

  return (
    <div className="max-w-[1024px] mx-auto px-10 py-12 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-card-lg border border-black/5 shadow-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-brand-cream overflow-hidden">
            <motion.div 
                className="h-full bg-brand-teal"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>

        <div className="p-12">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="px-3 py-1 bg-brand-teal/10 text-brand-teal text-[10px] font-bold uppercase tracking-widest rounded-md">Protocol Initiation</span>
                            <h2 className="text-3xl font-bold text-brand-slate tracking-tight">Define your presence.</h2>
                            <p className="text-slate-500 leading-relaxed font-medium">How do you intend to interact with the HelpHub community memory?</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { id: 'Seeker', label: 'Need Help', icon: <Target size={24} />, desc: 'I have problems to solve' },
                                { id: 'Helper', label: 'Can Help', icon: <Zap size={24} />, desc: 'I have signals to share' },
                                { id: 'Admin', label: 'Both', icon: <ShieldCheck size={24} />, desc: 'I am a community core' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setRole(opt.id as any)}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all ${
                                        role === opt.id 
                                        ? 'border-brand-teal bg-brand-teal/5 shadow-lg shadow-brand-teal/10' 
                                        : 'border-brand-cream hover:border-brand-teal/20'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${role === opt.id ? 'bg-brand-teal text-white' : 'bg-brand-cream text-brand-slate'}`}>
                                        {opt.icon}
                                    </div>
                                    <h4 className="font-bold text-brand-slate mb-1">{opt.label}</h4>
                                    <p className="text-[11px] text-slate-400 font-medium leading-tight">{opt.desc}</p>
                                </button>
                            ))}
                        </div>

                        <button 
                            disabled={!role}
                            onClick={handleNextStep}
                            className="w-full bg-brand-teal text-white py-4 rounded-button font-bold shadow-xl shadow-brand-teal/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            Next Step <ChevronRight size={18} />
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-brand-slate tracking-tight">Community Interests.</h2>
                            <p className="text-slate-500 font-medium">What topics or challenges are you most focused on right now?</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-extrabold text-slate-400 mb-2 uppercase tracking-widest">Add Interest (e.g. AI, Climate, Web3)</label>
                                <div className="flex gap-3">
                                    <input 
                                        type="text" 
                                        value={interestInput}
                                        onChange={(e) => setInterestInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                                        className="flex-1 bg-brand-cream rounded-xl px-5 py-4 outline-none font-bold text-base border-2 border-transparent focus:border-brand-teal transition-all"
                                    />
                                    <button onClick={addInterest} className="p-4 bg-brand-slate text-white rounded-xl hover:opacity-90 transition-all">
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 min-h-[48px]">
                                {interests.map(item => (
                                    <span key={item} className="px-4 py-2 bg-brand-teal/10 text-brand-teal rounded-lg font-bold text-sm flex items-center gap-2">
                                        {item}
                                        <button onClick={() => removeInterest(item)}><X size={14} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button 
                            disabled={interests.length === 0}
                            onClick={handleNextStep}
                            className="w-full bg-brand-teal text-white py-4 rounded-button font-bold shadow-xl shadow-brand-teal/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isAnalyzing ? <Loader2 className="animate-spin" /> : "Analyze Interests"} <ChevronRight size={18} />
                        </button>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-brand-teal font-extrabold text-[11px] uppercase tracking-widest">
                                <BrainCircuit size={16} /> Signal Intelligence Active
                            </div>
                            <h2 className="text-3xl font-bold text-brand-slate tracking-tight">AI Skill Suggestions.</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">Based on your interests, our intelligence engine suggests you might have these signals to contribute:</p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-brand-cream p-6 rounded-2xl border border-black/5">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Suggested Signal Clusters</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions?.suggestedSkills.map(s => (
                                        <button 
                                            key={s} 
                                            onClick={() => addSkill(s)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${skills.includes(s) ? 'bg-brand-teal text-white border-brand-teal' : 'bg-white text-brand-slate border-black/10 hover:border-brand-teal'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Verified Skill Stack</p>
                                <div className="flex flex-wrap gap-2 min-h-[48px]">
                                    {skills.map(item => (
                                        <span key={item} className="px-4 py-2 bg-brand-slate text-white rounded-lg font-bold text-sm flex items-center gap-2">
                                            {item}
                                            <button onClick={() => removeSkill(item)}><X size={14} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleNextStep}
                            className="w-full bg-brand-teal text-white py-4 rounded-button font-bold shadow-xl shadow-brand-teal/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            Refine Location <ChevronRight size={18} />
                        </button>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div 
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-brand-slate tracking-tight">Deployment Zone.</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">Where is your primary operational hub?</p>
                        </div>

                        <div className="space-y-6">
                            <div className="relative">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <input 
                                    type="text" 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="City, Country"
                                    className="w-full bg-brand-cream rounded-xl pl-14 pr-5 py-4 outline-none font-bold text-base border-2 border-transparent focus:border-brand-teal transition-all"
                                />
                            </div>

                            <div className="bg-brand-teal/5 p-6 rounded-2xl border border-brand-teal/10">
                                <h4 className="font-bold text-brand-slate mb-2">Protocol Ready</h4>
                                <p className="text-[13px] text-slate-600 leading-relaxed">
                                    Completing this onboarding grants you an initial <b>Pathfinder Trust Score of 10%</b>. Authenticate your profile below.
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={handleComplete}
                            className="w-full bg-brand-slate text-white py-4 rounded-button font-bold shadow-xl shadow-black/10 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            Finalize Profile <ChevronRight size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
