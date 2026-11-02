import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  SortAsc, 
  Search, 
  Globe, 
  LogOut, 
  AlertTriangle,
  Sparkles,
  BookOpen,
  Layers,
  ChevronDown,
  X,
  FileCheck,
  Compass,
  DollarSign,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../hooks/useApplications';
import { useAuth } from '../hooks/useAuth';
import { Application } from '../lib/supabase';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationModal } from './ApplicationModal';

export function Dashboard() {
  const navigate = useNavigate();
  const { 
    applications, 
    summary, 
    loading, 
    actionLoading, 
    error, 
    clearError, 
    createApplication, 
    updateApplication, 
    deleteApplication, 
    claimDemoData 
  } = useApplications();
  const { user, signOut } = useAuth();
  
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'status' | 'created_at'>('deadline');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [claimingData, setClaimingData] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Check if any demo data exists that hasn't been claimed yet
  const hasDemoData = useMemo(() => {
    return applications.some(app => app.user_id === null || app.user_id === undefined);
  }, [applications]);

  // Statistics calculation with color psychology metrics
  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter(a => a.status === 'applied').length;
    const pending = applications.filter(a => a.status === 'pending').length;
    const won = applications.filter(a => a.status === 'won').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;
    return { total, applied, pending, won, rejected };
  }, [applications]);

  // Urgent upcoming deadlines (due in the future, non-won/rejected, sorted by deadline)
  const urgentDeadlines = useMemo(() => {
    const now = new Date();
    return applications
      .filter(app => app.status !== 'won' && app.status !== 'rejected')
      .map(app => {
        const deadline = new Date(app.deadline);
        const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return { ...app, diffDays };
      })
      .sort((a, b) => a.diffDays - b.diffDays)
      .slice(0, 4);
  }, [applications]);

  // Filtered & sorted applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter(app => {
        if (filter !== 'all' && app.status !== filter) return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchTitle = app.title.toLowerCase().includes(term);
          const matchNotes = app.notes?.toLowerCase().includes(term);
          if (!matchTitle && !matchNotes) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        if (sortBy === 'status') {
          return a.status.localeCompare(b.status);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [applications, filter, searchTerm, sortBy]);

  const handleClaimData = async () => {
    setClaimingData(true);
    const { error } = await claimDemoData();
    setClaimingData(false);
    if (!error) {
      setClaimSuccess(true);
      setTimeout(() => setClaimSuccess(false), 5000);
    }
  };

  const handleSaveApplication = async (data: Omit<Application, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (editingApplication) {
      await updateApplication(editingApplication.id, data);
    } else {
      await createApplication(data);
    }
    setShowModal(false);
    setEditingApplication(null);
  };

  const handleEdit = (application: Application) => {
    setEditingApplication(application);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    await deleteApplication(id);
  };

  const handleStatusChange = async (id: string, status: Application['status']) => {
    await updateApplication(id, { 
      status, 
      submitted_at: status === 'applied' ? new Date().toISOString() : undefined 
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      
      {/* Full Webpage Ambient Fixed Background Photography of University Scholars & Students */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=85" 
          alt="University Students Webpage Background"
          className="w-full h-full object-cover brightness-95 contrast-[1.02] saturate-105" 
        />
        {/* Soft luminous veil: preserves full clarity of university students across the webpage */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-900/30 to-slate-950/60"></div>
      </div>
      
      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-40 glass-nav border-b border-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Identity with Radiant Glow */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-un-600 via-un-500 to-aurora-cyan flex items-center justify-center shadow-glow-un text-white flex-shrink-0 animate-pulse-subtle">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-display tracking-tight text-un-950">
                  Kaizen
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-200 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  UNESCO SDG-4
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 font-medium">
                Universal Fellowship & Higher Education Gateway
              </p>
            </div>
          </div>

          {/* Action CTAs & Profile Controls */}
          <div className="flex items-center gap-3">
            
            {/* Claim Demo Data Action */}
            {hasDemoData && (
              <button
                onClick={handleClaimData}
                disabled={claimingData || actionLoading}
                className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 border border-amber-300 text-amber-950 shadow-sm hover:shadow-glow-amber transition-all disabled:opacity-60"
                title="Claim pre-seeded demo applications as your permanent personal data"
              >
                <Sparkles className="w-4 h-4 text-amber-700 animate-bounce" style={{ animationDuration: '2s' }} />
                <span>{claimingData || actionLoading ? 'Processing Fellowships...' : 'Claim Demo Data as Mine'}</span>
              </button>
            )}

            {/* Add Scholarship CTA */}
            <button
              onClick={() => { setEditingApplication(null); setShowModal(true); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-un-600 via-un-500 to-aurora-cyan hover:from-un-700 hover:to-un-600 text-white shadow-md hover:shadow-glow-un transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Register Opportunity</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* User Profile Pill & Sign Out */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200/80">
              <button
                onClick={() => navigate('/profile')}
                className="hidden md:flex flex-col items-end text-right hover:opacity-80 transition-opacity p-1 rounded-lg"
                title="View Scholar Security Profile"
              >
                <span className="text-xs font-bold text-un-900 hover:text-un-600 transition-colors truncate max-w-[150px]">
                  {user?.email?.split('@')[0] || 'Global Scholar'}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                  {user?.email || 'Authenticated'}
                </span>
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="p-1.5 rounded-xl text-slate-400 hover:text-un-600 hover:bg-un-50 border border-transparent hover:border-un-100 transition-colors"
                title="Scholar Security Profile"
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-un-600 to-aurora-cyan text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'S'}
                </div>
              </button>
              
              <button
                onClick={() => signOut()}
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
                title="Sign Out of Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* API Error Alert Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-center justify-between text-sm shadow-sm animate-shake">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button 
              onClick={clearError} 
              className="p-1 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
              title="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Claim Success Banner */}
        {claimSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-sm shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>All 8 global demonstration scholarships have been claimed and permanently saved to your account!</span>
            </div>
            <button onClick={() => setClaimSuccess(false)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Pictorial UNESCO Horizon Hero Banner with University Students & Scholars Showcase */}
        <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-un-950 via-un-900 to-un-800 text-white relative overflow-hidden shadow-glass-lg border border-white/20">
          {/* Crystal-Clear Ambient Background Photography of University Scholars */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=85" 
              alt="University Students Collaborating"
              className="w-full h-full object-cover brightness-100 contrast-[1.02] saturate-105" 
            />
            {/* Transparent Right Scrim: Students collaborating on the right are 100% visible and bright */}
            <div className="absolute inset-0 bg-gradient-to-r from-un-950/90 via-un-950/40 to-transparent"></div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-aurora-cyan/20 to-un-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-aurora-cyan mb-3">
                <Globe className="w-3.5 h-3.5" />
                <span>UNESCO Global Education 2030 Observatory</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white leading-tight">
                Empowering World Scholars Through Universal Higher Education Access
              </h1>
              <p className="text-xs sm:text-sm text-un-100/90 mt-2 leading-relaxed mb-4">
                Track personal fellowship dossiers, automate AI agent submissions, and access verified endowments from top international institutions.
              </p>

              {/* Scholar Community Counter with Real Avatars */}
              <div className="inline-flex items-center gap-3 p-2 px-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="flex -space-x-2 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                    alt="Scholar" 
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-un-900 object-cover" 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" 
                    alt="Scholar" 
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-un-900 object-cover" 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" 
                    alt="Scholar" 
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-un-900 object-cover" 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80" 
                    alt="Scholar" 
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-un-900 object-cover" 
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>50,000+ Enrolled University Scholars</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <div className="text-[10px] text-aurora-cyan">Oxford • Harvard • MIT • Stanford • Cambridge</div>
                </div>
              </div>
            </div>

            {/* Live Pictorial Telemetry Badges & Campus Snapshot Card */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[280px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <div className="text-[11px] font-bold text-aurora-cyan uppercase tracking-wider flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5" /> 190+ Nations
                  </div>
                  <div className="text-lg font-bold text-white mt-1">Universal Reach</div>
                  <div className="text-[10px] text-un-200">SDG-4 Equity Standard</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> $45.8M+
                  </div>
                  <div className="text-lg font-bold text-white mt-1">Fund Monitored</div>
                  <div className="text-[10px] text-un-200">Active Endowments</div>
                </div>
              </div>

              {/* Scholar Feature Micro-Card */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-un-800/80 to-un-900/80 border border-white/10 backdrop-blur-md flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80" 
                  alt="Scholars Collaborating" 
                  className="w-14 h-12 rounded-xl object-cover ring-1 ring-white/30"
                  loading="lazy"
                />
                <div className="text-xs">
                  <div className="font-bold text-white flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-aurora-cyan" />
                    <span>Global Peer Network</span>
                  </div>
                  <div className="text-[11px] text-un-200 mt-0.5">
                    Connect with scholarship cohorts worldwide
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Radiant KPI Cards with Strong Color Psychology */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-aurora-cyan flex items-center gap-1.5 drop-shadow-sm">
                <Layers className="w-3.5 h-3.5" />
                Portfolio Telemetry & Status Metrics
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1 drop-shadow-md">
                Academic Application Pipeline
              </h2>
            </div>
            <p className="text-xs text-slate-200 drop-shadow-sm">
              Tracking <strong className="text-aurora-cyan font-semibold">{stats.total} Active Programs</strong> ({summary ? `${summary.total} Global Programs` : 'International Registry'})
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. In Review (Full-Bleed University Students Photo Background) */}
            <div className="relative rounded-3xl p-5 border-l-4 border-l-un-400 overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=85" 
                  alt="Students Studying"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-100 contrast-[1.02] saturate-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/35"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-aurora-cyan drop-shadow-md">In Review</span>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-un-500 to-aurora-cyan text-white flex items-center justify-center shadow-glow-un">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold font-display text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {stats.applied}
                </div>
                <div className="text-xs text-aurora-cyan font-bold flex items-center gap-1 drop-shadow-md">
                  <span>{stats.total > 0 ? Math.round((stats.applied / stats.total) * 100) : 0}% of portfolio</span>
                </div>
              </div>
            </div>

            {/* 2. Action Required (Full-Bleed University Library Photo Background) */}
            <div className="relative rounded-3xl p-5 border-l-4 border-l-amber-400 overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img 
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=85" 
                  alt="Student in Library"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-100 contrast-[1.02] saturate-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/35"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 drop-shadow-md">Action Required</span>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-glow-amber">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold font-display text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {stats.pending}
                </div>
                <div className="text-xs text-amber-300 font-bold flex items-center gap-1 drop-shadow-md">
                  <span>Drafting & documentation</span>
                </div>
              </div>
            </div>

            {/* 3. Awarded Laureates (Full-Bleed University Graduation Photo Background) */}
            <div className="relative rounded-3xl p-5 border-l-4 border-l-emerald-400 overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img 
                  src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=85" 
                  alt="University Graduation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-100 contrast-[1.02] saturate-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/35"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 drop-shadow-md">Awarded Laureate</span>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-glow-emerald">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold font-display text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {stats.won}
                </div>
                <div className="text-xs text-emerald-300 font-bold flex items-center gap-1 drop-shadow-md">
                  <span>Fellowship awards won</span>
                </div>
              </div>
            </div>

            {/* 4. Concluded / Archived (Full-Bleed Historic University Architecture Background) */}
            <div className="relative rounded-3xl p-5 border-l-4 border-l-slate-400 overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img 
                  src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=85" 
                  alt="Historic University Building"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-100 contrast-[1.02] saturate-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/35"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 drop-shadow-md">Concluded</span>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-500 to-slate-400 text-white flex items-center justify-center">
                    <XCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold font-display text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {stats.rejected}
                </div>
                <div className="text-xs text-slate-300 font-bold flex items-center gap-1 drop-shadow-md">
                  <span>Archived application rounds</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Priority Deadline Radar (Full-Bleed University Library Photo Background) */}
        {urgentDeadlines.length > 0 && (
          <section className="relative rounded-3xl p-5 sm:p-6 border border-amber-400/40 overflow-hidden shadow-2xl text-white">
            {/* Background Photography of University Library and Students */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=85" 
                alt="University Library Study"
                className="w-full h-full object-cover brightness-100 contrast-[1.02] saturate-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-transparent to-slate-950/50"></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-glow-amber flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                      Priority Deadline Radar
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/90 text-white border border-amber-300/50 shadow-xs">
                        Immediate Action Required
                      </span>
                    </h3>
                    <p className="text-xs text-amber-200/90">
                      High-priority scholarships closing in your upcoming academic cycle.
                    </p>
                  </div>
                </div>
              </div>

              {/* Urgent Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {urgentDeadlines.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleEdit(item)}
                    className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                          item.diffDays <= 0 
                            ? 'bg-red-500/90 text-white border border-red-300' 
                            : item.diffDays <= 7 
                              ? 'bg-amber-500/90 text-white animate-pulse border border-amber-300' 
                              : 'bg-un-600/90 text-white border border-un-400'
                        }`}>
                          {item.diffDays < 0 ? 'Overdue' : item.diffDays === 0 ? 'Due Today!' : `${item.diffDays} days left`}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-300">
                          {new Date(item.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 line-clamp-1 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10 text-[11px] font-bold text-amber-300 flex items-center justify-between">
                      <span>Review Application</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Global Scholar Laureates & Fellow Community Showcase */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-aurora-cyan flex items-center gap-1.5 drop-shadow-sm">
                <GraduationCap className="w-3.5 h-3.5" />
                UNESCO Global Scholar Network
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1 drop-shadow-md">
                Laureate Community & Peer Scholars
              </h2>
            </div>
            <p className="text-xs text-slate-200 drop-shadow-sm">
              Verified university students and fellows supported by international academic endowments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Scholar 1 */}
            <div className="glass-card rounded-3xl overflow-hidden border border-white/90 shadow-glass-sm hover:shadow-glass-hover transition-all duration-300 group flex flex-col justify-between">
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85" 
                  alt="Dr. Amina Diallo" 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 brightness-100" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600/90 text-white shadow-sm border border-blue-300/40 backdrop-blur-md">
                    Gates Millennium
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="text-sm font-bold font-display leading-tight">Dr. Amina Diallo</h4>
                  <p className="text-[11px] text-aurora-cyan mt-0.5 font-medium">Oxford University • Biomedical Sci.</p>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 italic leading-relaxed mb-3">
                  "Secured $120,000 for graduate doctoral research into genomic therapeutics in developing nations."
                </p>
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    $120,000 Awarded
                  </span>
                  <span className="text-slate-400 font-semibold">Cohort 2026</span>
                </div>
              </div>
            </div>

            {/* Scholar 2 */}
            <div className="glass-card rounded-3xl overflow-hidden border border-white/90 shadow-glass-sm hover:shadow-glass-hover transition-all duration-300 group flex flex-col justify-between">
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=85" 
                  alt="Mateo Silva" 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 brightness-100" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600/90 text-white shadow-sm border border-rose-300/40 backdrop-blur-md">
                    Coca-Cola Scholar
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="text-sm font-bold font-display leading-tight">Mateo Silva</h4>
                  <p className="text-[11px] text-aurora-cyan mt-0.5 font-medium">MIT • Robotics & AI Systems</p>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 italic leading-relaxed mb-3">
                  "First-generation scholar prototyping autonomous disaster-response drones for climate crisis zones."
                </p>
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    $20,000 Awarded
                  </span>
                  <span className="text-slate-400 font-semibold">Cohort 2026</span>
                </div>
              </div>
            </div>

            {/* Scholar 3 */}
            <div className="glass-card rounded-3xl overflow-hidden border border-white/90 shadow-glass-sm hover:shadow-glass-hover transition-all duration-300 group flex flex-col justify-between">
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85" 
                  alt="Priya Raman" 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 brightness-100" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-600/90 text-white shadow-sm border border-cyan-300/40 backdrop-blur-md">
                    Dell STEM Fellow
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="text-sm font-bold font-display leading-tight">Priya Raman</h4>
                  <p className="text-[11px] text-aurora-cyan mt-0.5 font-medium">Stanford • Clean Energy Tech</p>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 italic leading-relaxed mb-3">
                  "Engineering affordable solar storage solutions for off-grid rural primary classrooms."
                </p>
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    $20,000 + Tech Grant
                  </span>
                  <span className="text-slate-400 font-semibold">Cohort 2025</span>
                </div>
              </div>
            </div>

            {/* Scholar 4 */}
            <div className="glass-card rounded-3xl overflow-hidden border border-white/90 shadow-glass-sm hover:shadow-glass-hover transition-all duration-300 group flex flex-col justify-between">
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=85" 
                  alt="Lucas Vance" 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 brightness-100" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600/90 text-white shadow-sm border border-emerald-300/40 backdrop-blur-md">
                    QuestBridge Match
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="text-sm font-bold font-display leading-tight">Lucas Vance</h4>
                  <p className="text-[11px] text-aurora-cyan mt-0.5 font-medium">Harvard College • Economics</p>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 italic leading-relaxed mb-3">
                  "Full four-year match scholar analyzing microcredit accessibility for low-income founders."
                </p>
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Full Scholarship
                  </span>
                  <span className="text-slate-400 font-semibold">Cohort 2026</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section className="glass-card rounded-3xl p-4 sm:p-6 border border-white/90 shadow-glass-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by scholarship title, requirements, or notes..."
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl glass-input text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <SortAsc className="w-4 h-4 text-un-500" />
                <span className="hidden sm:inline">Sort By:</span>
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'deadline' | 'status' | 'created_at')}
                  className="text-xs sm:text-sm font-bold py-2.5 px-3.5 pr-8 rounded-xl border border-slate-200 bg-white/90 text-slate-800 focus:outline-none focus:ring-2 focus:ring-un-500 cursor-pointer appearance-none shadow-sm"
                >
                  <option value="deadline">📅 Upcoming Deadline</option>
                  <option value="status">📊 Current Status</option>
                  <option value="created_at">⏱️ Date Added</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quick Filter Pill Buttons with Visual Icons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-un-600 text-white shadow-md shadow-un-600/30'
                  : 'bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              All Programs ({stats.total})
            </button>

            <button
              onClick={() => setFilter('applied')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filter === 'applied'
                  ? 'bg-un-600 text-white shadow-md shadow-un-600/30'
                  : 'bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-un-500" />
              <span>In Review ({stats.applied})</span>
            </button>

            <button
              onClick={() => setFilter('pending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filter === 'pending'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Action Required ({stats.pending})</span>
            </button>

            <button
              onClick={() => setFilter('won')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filter === 'won'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-emerald-500" />
              <span>Awarded Laureates ({stats.won})</span>
            </button>

            <button
              onClick={() => setFilter('rejected')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filter === 'rejected'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Concluded ({stats.rejected})</span>
            </button>
          </div>
        </section>

        {/* Application Cards Grid */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card rounded-3xl p-6 h-64 animate-pulse flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-24 h-5 bg-slate-200 rounded-full"></div>
                    <div className="w-3/4 h-6 bg-slate-200 rounded-lg"></div>
                    <div className="w-1/2 h-4 bg-slate-200 rounded"></div>
                  </div>
                  <div className="w-full h-8 bg-slate-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : filteredApplications.length === 0 ? (
            /* Empty State with University Library Background */
            <div className="relative rounded-3xl p-12 text-center max-w-lg mx-auto border border-white/20 my-8 overflow-hidden shadow-2xl text-white">
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85" 
                  alt="University Library"
                  className="w-full h-full object-cover brightness-95 contrast-[1.02] saturate-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/70"></div>
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-un-600 to-aurora-cyan border border-white/30 text-white flex items-center justify-center mx-auto mb-4 shadow-glow-un">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-1">
                  {searchTerm || filter !== 'all' ? 'No Matching Opportunities Found' : 'Your Global Dossier is Empty'}
                </h3>
                <p className="text-xs text-slate-300 mb-6 max-w-sm mx-auto leading-relaxed">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search criteria or resetting the active status filter.'
                    : 'Register your target scholarships or launch the pre-seeded UNESCO demonstration fellowships.'}
                </p>
                
                <div className="flex items-center justify-center gap-3">
                  {searchTerm || filter !== 'all' ? (
                    <button
                      onClick={() => { setSearchTerm(''); setFilter('all'); }}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-colors"
                    >
                      Clear All Filters
                    </button>
                  ) : (
                    <button
                      onClick={() => { setEditingApplication(null); setShowModal(true); }}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-un-600 to-aurora-cyan text-white shadow-md hover:shadow-glow-un transition-all"
                    >
                      + Register New Scholarship
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/60 bg-white/40 backdrop-blur-md py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-un-900 font-semibold">
            <Globe className="w-4 h-4 text-un-600" />
            <span>Kaizen • UNESCO Social Service Solution</span>
          </div>
          <div>
            In alignment with UN Sustainable Development Goal 4: Quality & Equitable Education For All
          </div>
        </div>
      </footer>

      {/* Add / Edit Application Modal */}
      {showModal && (
        <ApplicationModal
          application={editingApplication}
          onSave={handleSaveApplication}
          onClose={() => { setShowModal(false); setEditingApplication(null); }}
        />
      )}
    </div>
  );
}