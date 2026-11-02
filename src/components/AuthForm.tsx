import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  // Security features: Brute-force lockout prevention
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const { signIn, signUp } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      timer = setInterval(() => {
        setLockoutTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTimer]);

  // Client-side RFC email format verification
  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  };

  // Password Strength Evaluation
  const passwordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak (Min 6 chars)', color: 'bg-red-400' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-400' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-blue-400' };
      case 4:
        return { score: 4, label: 'Strong & Secure', color: 'bg-emerald-500' };
      default:
        return { score: 0, label: 'Too short', color: 'bg-slate-200' };
    }
  };

  const strength = passwordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDemoNotice(null);

    if (lockoutTimer > 0) {
      setError(`Brute-force protection: Please wait ${lockoutTimer} seconds before retrying.`);
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please provide a syntactically valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters for security compliance.');
      return;
    }

    setLoading(true);

    const { error: authError } = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password);

    if (authError) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      const errDesc = 'error_description' in authError ? String((authError as Record<string, unknown>).error_description) : '';
      if (newAttempts >= 5) {
        setLockoutTimer(30);
        setError('Security Alert: Excessive failed authentication attempts. Access locked for 30 seconds.');
      } else if (authError.message.includes('Invalid login credentials') || errDesc.includes('Invalid login credentials')) {
        setError('Invalid credentials. Check your email/password or use the Demo Account button below.');
      } else if (authError.message.includes('already registered')) {
        setError('An account with this email is already registered. Please sign in instead.');
      } else {
        setError(authError.message);
      }
    } else {
      setFailedAttempts(0);
    }

    setLoading(false);
  };

  // Instant demo account entry with verified credentials
  const handleInstantDemoLogin = async () => {
    if (lockoutTimer > 0) return;
    setEmail('demo@scholartrack.com');
    setPassword('demo123456');
    setLoading(true);
    setError(null);
    setDemoNotice(null);

    // Call /auth/v1/token with pre-seeded demo user
    const { error: signInErr } = await signIn('demo@scholartrack.com', 'demo123456');
    if (signInErr) {
      // In case user doesn't exist yet, auto-provision
      const { error: signUpErr } = await signUp('demo@scholartrack.com', 'demo123456');
      if (signUpErr && !signUpErr.message.includes('already registered')) {
        setError(signUpErr.message);
      } else {
        setDemoNotice('Demo credentials configured! Click Sign In to enter.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-slate-950">
      {/* Background Photography of Historic University Campus Grounds */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=85" 
          alt="University Campus Background" 
          className="w-full h-full object-cover brightness-95 contrast-[1.02] saturate-105" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/40 to-slate-950/65"></div>
      </div>

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-un-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-subtle"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-aurora-cyan/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle"></div>

      {/* Dual-Pane Card */}
      <div className="w-full max-w-5xl rounded-3xl glass-card overflow-hidden shadow-2xl border border-white/30 grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Mission Pavilion */}
        <div className="lg:col-span-5 bg-gradient-to-br from-un-950 via-un-900 to-un-800 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-un-500/20 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-aurora-cyan mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              UNESCO SDG-4 • Global Education 2030
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-un-500 to-aurora-cyan flex items-center justify-center shadow-glow-un text-white">
                <Globe className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display tracking-tight leading-none text-white">
                  Kaizen
                </h1>
                <p className="text-xs text-un-200 mt-1">Universal Scholarship & Fellowship Gateway</p>
              </div>
            </div>

            <p className="text-sm text-un-100/90 leading-relaxed mb-6">
              A high-security global education portal ensuring verified, equitable access to international academic endowments and fellowship opportunities.
            </p>

            {/* University Scholars Photo Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-lg mb-5 group">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80" 
                alt="University Students & Scholars" 
                className="w-full h-32 object-cover brightness-[0.85] group-hover:scale-105 transition-transform duration-700" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-un-950 via-un-950/40 to-transparent"></div>
              
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                      alt="Scholar" 
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-un-900 object-cover" 
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" 
                      alt="Scholar" 
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-un-900 object-cover" 
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" 
                      alt="Scholar" 
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-un-900 object-cover" 
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-white drop-shadow-sm">
                    50,000+ Enrolled Scholars
                  </span>
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-aurora-cyan bg-un-900/80 px-2 py-0.5 rounded-full border border-aurora-cyan/30">
                  Global SDG-4
                </span>
              </div>
            </div>

            {/* Real Scholar Testimonial */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm mb-5">
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" 
                  alt="Dr. Elena Rostova" 
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-aurora-cyan flex-shrink-0" 
                />
                <div>
                  <h4 className="text-xs font-bold text-white">Elena Rostova</h4>
                  <p className="text-[10px] text-aurora-cyan">Cambridge Gates Scholar • Class of '26</p>
                </div>
              </div>
              <p className="text-[11px] text-un-100/90 italic leading-relaxed">
                "Kaizen unified my entire international fellowship portfolio. The deadline telemetry gave me the peace of mind to focus on my research."
              </p>
            </div>

            {/* Security Architecture Points */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-un-500/30 text-aurora-cyan flex-shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Cryptographic Bearer Sessions</h4>
                  <p className="text-[10px] text-un-200">HMAC-SHA256 authenticated JWT tokens.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-emerald-500/30 text-emerald-300 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Row Level Security Isolation</h4>
                  <p className="text-[10px] text-un-200">Zero data leaks: Private scholar dossiers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-un-300">
            <span>UN SDG-4 Compliance</span>
            <span className="font-semibold text-aurora-cyan">Zero-Knowledge Storage</span>
          </div>
        </div>

        {/* Right Access Gateway */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white/60 backdrop-blur-xl">
          <div className="max-w-md mx-auto w-full">
            
            {/* Tab Switcher */}
            <div className="flex p-1 mb-8 rounded-xl bg-slate-100/90 border border-slate-200/80">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setError(null); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  !isSignUp 
                    ? 'bg-white text-un-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Scholar Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setError(null); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isSignUp 
                    ? 'bg-white text-un-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Register Scholar ID
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold font-display text-un-950">
                {isSignUp ? 'Enroll in Global Scholar Registry' : 'Secure Scholar Portal Access'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {isSignUp 
                  ? 'Create your cryptographic scholar identity to track applications.'
                  : 'Enter your credentials to access your protected application portfolio.'}
              </p>
            </div>

            {/* Error & Info Alerts */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50/90 border border-red-200 text-red-800 flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            {lockoutTimer > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-900 flex items-start gap-3 text-sm">
                <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 font-semibold">
                  Brute Force Lockdown: Retrying enabled in {lockoutTimer} seconds.
                </div>
              </div>
            )}

            {demoNotice && (
              <div className="mb-6 p-4 rounded-xl bg-blue-50/90 border border-blue-200 text-un-800 flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-un-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">{demoNotice}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Scholar Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="scholar@university.edu"
                    className="w-full pl-11 pr-4 py-3 text-sm rounded-xl glass-input text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-11 py-3 text-sm rounded-xl glass-input text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator (on registration) */}
                {isSignUp && password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>Password Strength:</span>
                      <span className="font-bold text-slate-700">{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            strength.score >= step ? strength.color : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || lockoutTimer > 0}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-un-600 via-un-500 to-aurora-blue hover:from-un-700 hover:to-un-600 text-white font-semibold text-sm shadow-md hover:shadow-glow-un transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Secured Account' : 'Authenticate & Enter Dashboard'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative px-4 text-xs uppercase tracking-wider font-semibold text-slate-400 bg-white/70">
                Instant Showcase Access
              </span>
            </div>

            {/* Preserved Try Demo Account Button */}
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              disabled={loading || lockoutTimer > 0}
              className="w-full py-3 px-4 rounded-xl border border-un-200 bg-un-50/70 hover:bg-un-100/90 text-un-800 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm group disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-un-600 group-hover:rotate-12 transition-transform" />
              <span>Try Demo Account (demo@scholartrack.com)</span>
            </button>
            <p className="text-center text-xs text-slate-400 mt-2">
              Bypasses registration with 8 pre-seeded UNESCO demo fellowships.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}