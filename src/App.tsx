/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  MessageSquare, 
  User as UserIcon, 
  LogOut, 
  BrainCircuit,
  Trophy,
  Zap,
  LayoutDashboard,
  Activity
} from 'lucide-react';
import { useStore } from './store/useStore';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { dbService } from './services/dbService';
import { User } from './types';
import { LoginPage, ExplorePage } from './components/pages/CorePages';
import { OnboardingPage } from './components/pages/OnboardingPage';
import { HomePage } from './components/pages/HomePage';
import { CreateRequestPage, RequestDetailPage } from './components/pages/SupportPages';
import { LeaderboardPage, NotificationsPage, AICenterPage, MessagesPage } from './components/pages/SocialPages';
import { ProfilePage } from './components/pages/ProfilePage';
import { SettingsPage } from './components/pages/SettingsPage';
import { Chatbot } from './components/Chatbot';

// --- Global Components ---

const Navbar = ({ activePage, setActivePage, user, notifications }: any) => {
  const unreadCount = notifications?.filter((n: any) => !n.read).length || 0;

  const navItems = [
    { id: 'home', icon: <LayoutDashboard size={18} />, label: 'Hub' },
    { id: 'explore', icon: <Activity size={18} />, label: 'Signals' },
    { id: 'leaderboard', icon: <Trophy size={18} />, label: 'Pathfinders' },
    { id: 'ai-center', icon: <BrainCircuit size={18} />, label: 'AI Insights' },
  ];

  return (
    <nav className="h-[64px] bg-white/80 border-b border-black/5 sticky top-0 z-50 px-10 flex items-center justify-between backdrop-blur-md">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setActivePage('home')}
      >
        <div className="w-8 h-8 bg-brand-slate rounded-lg flex items-center justify-center text-brand-teal scale-100 group-hover:scale-110 transition-all font-extrabold text-xl">
          <Zap size={18} />
        </div>
        <span className="text-lg font-black tracking-tighter text-brand-slate uppercase">HelpHub <span className="text-brand-teal">AI</span></span>
      </div>
      
      <div className="hidden lg:flex items-center gap-2">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActivePage(item.id)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activePage === item.id ? 'bg-brand-slate text-white' : 'text-slate-400 hover:text-brand-slate hover:bg-brand-cream'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2 text-slate-400">
              <button onClick={() => setActivePage('notifications')} className="p-2.5 hover:text-brand-teal transition-colors relative">
                <Bell size={18} />
                {unreadCount > 0 && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-teal rounded-full"></span>}
              </button>
              <button onClick={() => setActivePage('messages')} className="p-2.5 hover:text-brand-teal transition-colors">
                <MessageSquare size={18} />
              </button>
            </div>
            
            <div className="h-6 w-px bg-black/5 mx-2"></div>
            
            <button onClick={() => setActivePage('profile')} className="flex items-center gap-3 group">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-brand-slate leading-none mb-1 group-hover:text-brand-teal transition-colors tracking-widest uppercase">{user.name}</p>
                <p className="text-[10px] font-bold text-brand-teal">TRUST {user.trustScore}%</p>
              </div>
              <img src={user.avatar} className="w-9 h-9 rounded-xl border border-black/5 shadow-sm" referrerPolicy="no-referrer" />
            </button>
            <button 
              onClick={() => isSupabaseConfigured && supabase.auth.signOut()} 
              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <button 
            onClick={() => setActivePage('login')}
            className={`bg-brand-teal text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-teal/20 transition-all active:scale-95 hover:opacity-90`}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

// --- Main App Component ---

export default function App() {
  const { 
    activePage, 
    setActivePage, 
    user, 
    setUser, 
    requests, 
    setRequests,
    notifications,
    setNotifications
  } = useStore();

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [leaderboardUsers, setLeaderboardUsers] = useState<User[]>([]);

  // Auth Listener
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthState(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthState(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [isSupabaseConfigured]);

  // Navigation Logic (Auth Wall & Redirection)
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Handle logout redirect
    if (!user) {
      if (activePage !== 'login' && activePage !== 'settings') {
        setActivePage('login');
      }
      return;
    }

    // Handle login redirect
    if (activePage === 'login') {
       // New user detection
       if (!user.location || user.location === 'Not set') {
         setActivePage('onboarding');
       } else {
         setActivePage('home');
       }
    }
  }, [user, activePage, isSupabaseConfigured]);

  async function handleAuthState(sbUser: any) {
    if (sbUser) {
      let profile = await dbService.getProfile(sbUser.id);
      if (!profile) {
        const freshProfile: User = {
          id: sbUser.id,
          uid: sbUser.id,
          name: sbUser.user_metadata?.full_name || 'Unknown Pathfinder',
          email: sbUser.email || '',
          avatar: sbUser.user_metadata?.avatar_url || `https://picsum.photos/seed/${sbUser.id}/100/100`,
          trustScore: 0,
          role: (sbUser.user_metadata?.role as any) || 'Seeker',
          skills: [],
          interests: [],
          location: 'Not set',
          contributions: 0,
          badges: []
        };
        await dbService.saveProfile(sbUser.id, freshProfile);
        profile = freshProfile;
      }
      setUser(profile);
      if (profile && (!profile.location || profile.location === 'Not set')) {
        setActivePage('onboarding');
      }
    } else {
      setUser(null);
    }
  }

  // Data Listeners
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const unsubRequests = dbService.subscribeToRequests(setRequests);
    const unsubLeaderboard = dbService.subscribeToLeaderboard(setLeaderboardUsers);
    let unsubNotifications = () => {};
    
    if (user) {
      unsubNotifications = dbService.subscribeToNotifications(user.id, setNotifications);
    }

    return () => {
      unsubRequests();
      unsubLeaderboard();
      unsubNotifications();
    };
  }, [setRequests, user, setNotifications, isSupabaseConfigured]);

  const renderPage = () => {
    // Auth Wall: Protect all pages for logged out users
    if (!user && activePage !== 'settings') {
        return <LoginPage />;
    }

    switch (activePage) {
      case 'home': return <HomePage requests={requests} setSelectedRequestId={setSelectedRequestId} setActivePage={setActivePage} />;
      case 'explore': return <ExplorePage requests={requests} setSelectedRequestId={setSelectedRequestId} setActivePage={setActivePage} />;
      case 'leaderboard': return <LeaderboardPage users={leaderboardUsers} />;
      case 'ai-center': return <AICenterPage requests={requests} setSelectedRequestId={setSelectedRequestId} setActivePage={setActivePage} />;
      case 'onboarding': return <OnboardingPage />;
      case 'login': return <LoginPage />;
      case 'profile': return <ProfilePage user={user} setUser={setUser} />;
      case 'create-request': return <CreateRequestPage />;
      case 'request-detail': return <RequestDetailPage requests={requests} selectedRequestId={selectedRequestId} users={leaderboardUsers} />;
      case 'notifications': return <NotificationsPage notifications={notifications} />;
      case 'messages': return <MessagesPage users={leaderboardUsers} />;
      case 'settings': return <SettingsPage />;
      default: return <HomePage requests={requests} setSelectedRequestId={setSelectedRequestId} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-brand-teal/20 selection:text-brand-teal">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        user={user}
        notifications={notifications}
      />

      {!isSupabaseConfigured && (
        <div 
          onClick={() => setActivePage('settings')}
          className="bg-brand-teal text-white px-10 py-3 text-center text-xs font-bold uppercase tracking-widest shadow-xl sticky top-[64px] z-40 animate-pulse cursor-pointer hover:bg-brand-slate transition-colors"
        >
          Connection Node Offline: Please configure Supabase URL and Key in Settings to enable real-time signals. <u>Click to configure.</u>
        </div>
      )}
      
      <main className="pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Chatbot />

      <footer className="bg-[#1E2322] py-32 px-10 text-white relative overflow-hidden">
        <div className="max-w-[1024px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-brand-teal rounded-xl flex items-center justify-center text-white">
                        <Zap size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-black tracking-tighter uppercase">HelpHub <span className="text-brand-teal">AI</span></span>
                </div>
                <p className="text-white/40 max-w-sm leading-relaxed font-medium">Empowering local communities with global intelligence. Join over 5,000 Verified Pathfinders providing high-trust signals daily.</p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
            <p>© 2026 HelpHub Intelligence Protocol. All signals encrypted.</p>
            <div className="flex gap-8">
                <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
                <span className="hover:text-white cursor-pointer transition-colors">Nodes</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal opacity-[0.05] rounded-full blur-[100px] translate-y-[-50%] translate-x-[30%]"></div>
      </footer>
    </div>
  );
}
