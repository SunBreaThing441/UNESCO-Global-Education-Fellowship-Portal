import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Clock, 
  ArrowLeft, 
  LogOut, 
  Download, 
  Copy, 
  Check, 
  FileCheck2,
  Trophy,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useApplications } from '../hooks/useApplications';

const scholarAvatars = [
  { id: '1', name: 'Dr. Amina Diallo', university: 'Oxford', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
  { id: '2', name: 'Mateo Silva', university: 'MIT', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: '3', name: 'Priya Raman', university: 'Stanford', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { id: '4', name: 'Lucas Vance', university: 'Harvard', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80' },
];

export function Profile() {
  const { user, session, signOut } = useAuth();
  const { applications } = useApplications();
  const navigate = useNavigate();

  const [selectedAvatar, setSelectedAvatar] = useState(scholarAvatars[0].url);
  const [copiedId, setCopiedId] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const wonCount = applications.filter(a => a.status === 'won').length;
  const appliedCount = applications.filter(a => a.status === 'applied').length;
  const pendingCount = applications.filter(a => a.status === 'pending').length;

  const handleExportData = () => {
    const exportPayload = {
      scholar: {
        id: user?.id,
        email: user?.email,
        role: user?.role,
        exported_at: new Date().toISOString(),
      },
      portfolio_summary: {
        total_fellowships: applications.length,
        applied: appliedCount,
        won: wonCount,
        pending: pendingCount,
        rejected: applications.filter(a => a.status === 'rejected').length,
      },
      applications: applications,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kaizen-scholar-dossier-${user?.id?.slice(0, 8) || 'export'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const expiresAt = session?.expires_at ? new Date(session.expires_at * 1000) : null;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Full Webpage Fixed Background Photography */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=85" 
          alt="University Campus Life"
          className="w-full h-full object-cover brightness-95 contrast-[1.02] saturate-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-900/30 to-slate-950/60"></div>
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 glass-nav border-b border-white/90">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl text-slate-500 hover:text-un-600 hover:bg-un-50 border border-slate-200/80 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-5 w-px bg-slate-200"></div>
            <span className="text-sm font-extrabold font-display text-un-950">
              Scholar Credentials & Security Dossier
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
        
        {/* Profile Identity Card with Full-Bleed University Campus Background */}
        <div className="relative rounded-3xl p-6 sm:p-8 border border-white/25 shadow-2xl overflow-hidden text-white">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=85" 
              alt="University Campus Grounds" 
              className="w-full h-full object-cover brightness-100 contrast-[1.02] saturate-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-transparent to-slate-950/75"></div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              
              {/* Pictorial Scholar Photo Avatar */}
              <div className="relative group/avatar flex-shrink-0">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl ring-4 ring-white/80 border-2 border-un-400 flex-shrink-0 bg-slate-900">
                  <img 
                    src={selectedAvatar} 
                    alt="Active Scholar" 
                    className="w-full h-full object-cover object-top" 
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-un-600 to-aurora-cyan text-white flex items-center justify-center shadow-md border-2 border-slate-900">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950/80 text-emerald-300 border border-emerald-400/40 shadow-sm mb-1.5 backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>UNESCO SDG-4 Verified Scholar Profile</span>
                </div>
                <h1 className="text-2xl font-extrabold font-display text-white">
                  {user?.email || 'Authenticated Scholar'}
                </h1>
                <p className="text-xs text-slate-300 font-medium">
                  Higher Education Equity Protocol • Universal Scholar Registry
                </p>

                {/* Interactive Avatar Persona Switcher */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-aurora-cyan">Scholar Persona:</span>
                  <div className="flex items-center gap-1.5">
                    {scholarAvatars.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.url)}
                        title={`${av.name} (${av.university})`}
                        className={`w-7 h-7 rounded-xl overflow-hidden ring-2 transition-all cursor-pointer ${
                          selectedAvatar === av.url ? 'ring-aurora-cyan scale-110 shadow-sm' : 'ring-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-un-600 to-aurora-cyan text-white shadow-md hover:shadow-glow-un transition-all"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Dossier Exported!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export Scholar Dossier (JSON)</span>
                </>
              )}
            </button>
          </div>

          {/* Pictorial Scholar Telemetry Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/15 relative z-10">
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md text-center">
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Total Programs</div>
              <div className="text-xl font-extrabold font-display text-white mt-0.5">{applications.length}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-400/30 backdrop-blur-md text-center">
              <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3" /> Laureates Won
              </div>
              <div className="text-xl font-extrabold font-display text-emerald-300 mt-0.5">{wonCount}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-un-950/70 border border-un-400/30 backdrop-blur-md text-center">
              <div className="text-[10px] font-bold text-aurora-cyan uppercase tracking-wider">In Review</div>
              <div className="text-xl font-extrabold font-display text-aurora-cyan mt-0.5">{appliedCount}</div>
            </div>
          </div>

          {/* Identity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 relative z-10">
            
            {/* Scholar UUID */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center justify-between">
                <span>Unique Scholar ID (UUID)</span>
                <button
                  onClick={handleCopyId}
                  className="text-aurora-cyan hover:text-white flex items-center gap-1 text-[11px] font-bold"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <code className="text-xs font-mono text-slate-200 break-all select-all font-semibold">
                {user?.id || '00000000-0000-0000-0000-000000000000'}
              </code>
            </div>

            {/* Email Address */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Verified Communication Channel
              </div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-aurora-cyan" />
                <span>{user?.email}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Security & Token Telemetry Card with University Library Background */}
        <div className="relative rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl overflow-hidden text-white">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1400&q=85" 
              alt="University Library Archive"
              className="w-full h-full object-cover brightness-100 contrast-[1.02] saturate-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-transparent to-slate-950/75"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-un-500 to-aurora-cyan text-white shadow-glow-un">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-white">
                  Cryptographic Telemetry & Session Integrity
                </h2>
                <p className="text-xs text-slate-300">
                  Authenticated session token active on Kaizen API Gateway (Port 3001)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md">
                <div className="text-xs text-aurora-cyan font-bold mb-1">
                  Token Format
                </div>
                <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-glow-emerald"></span>
                  <span>JWT HS256 Bearer</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-medium">
                  Cryptographically signed token
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md">
                <div className="text-xs text-aurora-cyan font-bold mb-1">
                  Security Scope
                </div>
                <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{user?.role || 'authenticated'}</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-medium">
                  Row Level Security enforced
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md">
                <div className="text-xs text-aurora-cyan font-bold mb-1">
                  Token Expiration
                </div>
                <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>
                    {expiresAt ? expiresAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Active Session'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-medium">
                  Auto-refreshed via Kaizen engine
                </div>
              </div>

            </div>

            {/* Security Standards Checklist */}
            <div className="mt-6 pt-6 border-t border-white/15 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-aurora-cyan mb-2">
                Verified Compliance Standards
              </div>
              
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <FileCheck2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>TLS / HTTPS Transport Security with Cross-Origin Resource Sharing (CORS) enforcement</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-200">
                <FileCheck2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>User-isolated data isolation: Row Level Security restricts queries to <code className="font-mono text-aurora-cyan">auth.uid() = user_id</code></span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-200">
                <FileCheck2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Session Fixation Defense: Local JWT storage is wiped on termination</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Peer Scholars & Academic Mentors Network with Lecture Hall Background */}
        <div className="relative rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl overflow-hidden text-white">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=85" 
              alt="Academic Lecture Hall"
              className="w-full h-full object-cover brightness-100 contrast-[1.02] saturate-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-transparent to-slate-950/75"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-aurora-cyan flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  UNESCO Academic Advisory Circle
                </div>
                <h2 className="text-lg font-bold font-display text-white mt-0.5">
                  Assigned Fellowship Mentors & Cohort Peers
                </h2>
              </div>
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-400/30 backdrop-blur-md">
                3 Mentors Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md flex items-center gap-3.5 hover:border-aurora-cyan transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" 
                  alt="Prof. Julian Sterling" 
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-un-400 flex-shrink-0" 
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">Julian Sterling, Ph.D.</h4>
                  <p className="text-[10px] text-aurora-cyan font-semibold truncate">Oxford • Rhodes Advisor</p>
                  <span className="text-[10px] text-slate-300">Genomics & Health</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md flex items-center gap-3.5 hover:border-emerald-400 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80" 
                  alt="Dr. Claire Fontaine" 
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-400 flex-shrink-0" 
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">Claire Fontaine, M.S.</h4>
                  <p className="text-[10px] text-emerald-300 font-semibold truncate">Sorbonne • UNESCO Chair</p>
                  <span className="text-[10px] text-slate-300">International Policy</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md flex items-center gap-3.5 hover:border-cyan-400 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80" 
                  alt="Marcus K. Adebayo" 
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-cyan-400 flex-shrink-0" 
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">Marcus K. Adebayo</h4>
                  <p className="text-[10px] text-aurora-cyan font-semibold truncate">Stanford • Gates Peer Mentor</p>
                  <span className="text-[10px] text-slate-300">Clean Energy Systems</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/60 bg-white/40 py-5 text-xs text-slate-500 text-center">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <span>Kaizen Security Framework • Port 3001 Connected</span>
          <span>UNESCO SDG-4 Open Access Protocol</span>
        </div>
      </footer>
    </div>
  );
}
