import React, { useState } from 'react';
import { 
  Calendar, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Edit3, 
  Trash2, 
  FileText, 
  AlertTriangle,
  GraduationCap,
  Award,
  Medal,
  Sparkles,
  Shield,
  Compass,
  DollarSign
} from 'lucide-react';
import { Application } from '../lib/supabase';

interface ApplicationCardProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Application['status']) => void;
}

// Visual scholarship profiles with institutional crests, grant sizes, photography, and student scholar cohorts
const scholarshipProfiles: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  category: string;
  value: string;
  crestBorder: string;
  image: string;
  scholarsCount: number;
  scholarsAvatars: string[];
}> = {
  'Gates Millennium Scholarship': {
    icon: GraduationCap,
    gradient: 'from-blue-600 via-indigo-600 to-un-900',
    crestBorder: 'border-blue-300',
    category: 'Full Ride Endowment',
    value: '$120,000+',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85',
    scholarsCount: 142,
    scholarsAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    ],
  },
  'National Merit Scholarship': {
    icon: Medal,
    gradient: 'from-amber-500 via-yellow-500 to-amber-700',
    crestBorder: 'border-yellow-300',
    category: 'Prestigious Merit Award',
    value: '$10,000 / Yr',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=85',
    scholarsCount: 88,
    scholarsAvatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
    ],
  },
  'Coca-Cola Scholars Program': {
    icon: Trophy,
    gradient: 'from-red-600 via-rose-600 to-amber-600',
    crestBorder: 'border-rose-300',
    category: 'Leadership & Service',
    value: '$20,000 Award',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85',
    scholarsCount: 150,
    scholarsAvatars: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    ],
  },
  'Dell Scholars Program': {
    icon: Sparkles,
    gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
    crestBorder: 'border-cyan-300',
    category: 'STEM & Higher Ed Access',
    value: '$20,000 + Laptop',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85',
    scholarsCount: 110,
    scholarsAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=120&q=80',
    ],
  },
  'Jack Kent Cooke Foundation Scholarship': {
    icon: Award,
    gradient: 'from-purple-600 via-violet-600 to-indigo-800',
    crestBorder: 'border-purple-300',
    category: 'Comprehensive Honors Grant',
    value: 'Up to $55,000/Yr',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=85',
    scholarsCount: 65,
    scholarsAvatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    ],
  },
  'QuestBridge National College Match': {
    icon: Compass,
    gradient: 'from-emerald-600 via-teal-600 to-blue-700',
    crestBorder: 'border-emerald-300',
    category: '4-Year Match Full Ride',
    value: 'Full Scholarship',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=85',
    scholarsCount: 220,
    scholarsAvatars: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
    ],
  },
  'Hispanic Scholarship Fund': {
    icon: Shield,
    gradient: 'from-orange-500 via-amber-600 to-red-600',
    crestBorder: 'border-amber-300',
    category: 'Heritage & Academic Fund',
    value: '$500 – $5,000',
    image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1200&q=85',
    scholarsCount: 195,
    scholarsAvatars: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    ],
  },
  'Elks National Foundation Most Valuable Student': {
    icon: Trophy,
    gradient: 'from-emerald-600 via-green-600 to-slate-800',
    crestBorder: 'border-emerald-300',
    category: 'Community Excellence',
    value: '$4,000 – $50,000',
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1200&q=85',
    scholarsCount: 94,
    scholarsAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    ],
  },
};

export function ApplicationCard({ application, onEdit, onDelete, onStatusChange }: ApplicationCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Status Color Psychology Configuration
  const statusConfig = {
    applied: {
      label: 'Submitted & In Review',
      badgeClass: 'bg-un-950/85 text-aurora-cyan border-un-400/50 shadow-sm',
      dotClass: 'bg-un-400 animate-pulse shadow-glow-un',
      topBorder: 'from-un-500 via-aurora-cyan to-transparent',
      textColor: 'text-aurora-cyan',
      icon: CheckCircle2,
    },
    pending: {
      label: 'Action Required',
      badgeClass: 'bg-amber-950/85 text-amber-300 border-amber-400/50 shadow-sm',
      dotClass: 'bg-amber-400 shadow-glow-amber',
      topBorder: 'from-amber-400 via-yellow-300 to-transparent',
      textColor: 'text-amber-300',
      icon: Clock,
    },
    won: {
      label: 'Awarded Laureate',
      badgeClass: 'bg-emerald-950/85 text-emerald-300 border-emerald-400/50 shadow-sm',
      dotClass: 'bg-emerald-400 shadow-glow-emerald',
      topBorder: 'from-emerald-500 via-teal-300 to-transparent',
      textColor: 'text-emerald-300',
      icon: Trophy,
    },
    rejected: {
      label: 'Concluded / Closed',
      badgeClass: 'bg-slate-900/85 text-slate-300 border-slate-600/60 shadow-sm',
      dotClass: 'bg-slate-400',
      topBorder: 'from-slate-400 via-slate-200 to-transparent',
      textColor: 'text-slate-400',
      icon: XCircle,
    },
  };

  const currentStatus = statusConfig[application.status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  // Visual Profile matching
  const profile = scholarshipProfiles[application.title] || {
    icon: GraduationCap,
    gradient: 'from-un-600 via-un-500 to-aurora-cyan',
    crestBorder: 'border-un-300',
    category: 'International Grant',
    value: 'Accredited Fund',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85',
    scholarsCount: 75,
    scholarsAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    ],
  };
  const CrestIcon = profile.icon;

  // Deadline & Progress Computation
  const deadlineDate = new Date(application.deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const daysUntilDeadline = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntilDeadline < 0 && application.status !== 'won' && application.status !== 'rejected';
  const isImminent = daysUntilDeadline >= 0 && daysUntilDeadline <= 5 && application.status !== 'won' && application.status !== 'rejected';

  // Progress Bar percentage (simulating 60-day cycle)
  const totalWindowDays = 60;
  const daysRemainingClamped = Math.max(0, Math.min(totalWindowDays, daysUntilDeadline));
  const progressPercent = Math.round(((totalWindowDays - daysRemainingClamped) / totalWindowDays) * 100);

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to remove "${application.title}" from your dossier?`)) {
      setIsDeleting(true);
      onDelete(application.id);
    }
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden flex flex-col justify-between group border border-white/25 shadow-glass-lg hover:shadow-2xl transition-all duration-300 min-h-[430px] p-6 text-white ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}>
      
      {/* FULL-BLEED BACKGROUND PHOTOGRAPHY: 100% Crystal-Clear, Bright University Students & Campus */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img 
          src={profile.image} 
          alt={application.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-100 contrast-[1.02] saturate-105"
          loading="lazy"
        />
        {/* Transparent Center Scrim: Zero dimming over students, gentle contrast only at extreme edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/75"></div>
      </div>

      {/* Specular Luminescent Top Border */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${currentStatus.topBorder} z-20`}></div>

      {/* Card Content Layer - High Contrast Z-Index 10 */}
      <div className="relative z-10 flex-1 flex flex-col justify-between">
        <div>
          {/* Header: Institutional Crest, Category & Quick Controls */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              {/* Institutional Crest */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${profile.gradient} text-white flex items-center justify-center shadow-lg p-0.5 border ${profile.crestBorder} flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                <CrestIcon className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-aurora-cyan bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-aurora-cyan/30 shadow-xs">
                    {profile.category}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-400/40 flex items-center gap-0.5 shadow-xs">
                    <DollarSign className="w-2.5 h-2.5" />
                    {profile.value}
                  </span>
                </div>

                <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold backdrop-blur-md border ${currentStatus.badgeClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dotClass}`}></span>
                  <StatusIcon className="w-3 h-3 mr-0.5" />
                  <span>{currentStatus.label}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center gap-1 bg-slate-900/70 backdrop-blur-md p-1 rounded-xl border border-white/20">
              <button
                onClick={() => onEdit(application)}
                title="Edit Scholarship Dossier"
                className="p-1 rounded-lg text-white hover:text-aurora-cyan hover:bg-white/20 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDeleteClick}
                title="Remove Opportunity"
                className="p-1 rounded-lg text-white hover:text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scholarship Title with crisp shadow */}
          <h3 className="text-lg font-bold font-display text-white mb-2 leading-snug group-hover:text-aurora-cyan transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {application.title}
          </h3>

          {/* Chrono Meta & Visual Progress Meter */}
          <div className="space-y-2 mb-3 bg-slate-950/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shadow-md">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-100 font-medium">
                <Calendar className="w-3.5 h-3.5 text-aurora-cyan" />
                <span>Due: {deadlineDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>

              {/* Visual Urgency Pill */}
              {isOverdue && (
                <span className="px-2 py-0.5 rounded-md bg-red-500/80 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-sm border border-red-400/30">
                  <AlertTriangle className="w-3 h-3" /> Overdue
                </span>
              )}
              {!isOverdue && daysUntilDeadline === 0 && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-white font-extrabold text-[10px] animate-pulse border border-amber-300">
                  Due Today!
                </span>
              )}
              {!isOverdue && daysUntilDeadline > 0 && (
                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${
                  isImminent ? 'bg-amber-500/80 text-white border-amber-300/40' : 'bg-white/15 text-slate-100 border-white/20'
                }`}>
                  {daysUntilDeadline} {daysUntilDeadline === 1 ? 'day' : 'days'} left
                </span>
              )}
            </div>

            {/* Visual Deadline Progress Bar */}
            {daysUntilDeadline >= 0 && application.status !== 'won' && application.status !== 'rejected' && (
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isImminent 
                      ? 'bg-gradient-to-r from-amber-400 to-red-500' 
                      : 'bg-gradient-to-r from-un-400 to-aurora-cyan'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}

            {/* Submitted Date Verification */}
            {application.submitted_at && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Formally submitted on {new Date(application.submitted_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Dossier Notes / Essay Focus */}
          {application.notes && (
            <div className="mb-3 p-3 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/20 text-xs text-slate-100 flex items-start gap-2.5 shadow-md">
              <FileText className="w-3.5 h-3.5 text-aurora-cyan flex-shrink-0 mt-0.5" />
              <p className="line-clamp-2 italic leading-relaxed text-slate-100">
                "{application.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Card Footer: Cohort Avatars & Milestone Selector */}
        <div className="pt-3 border-t border-white/20 bg-slate-950/65 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shadow-md">
          {/* Pictorial Scholar Cohort Avatars */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5 overflow-hidden">
                {profile.scholarsAvatars.map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar}
                    alt="University Scholar"
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover shadow-xs"
                    loading="lazy"
                  />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-slate-300">
                <strong className="text-white">{profile.scholarsCount}+ scholars</strong> funded
              </span>
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-400/30">
              Verified
            </span>
          </div>

          {/* Action Link & Status Selector */}
          <div className="flex items-center justify-between gap-3">
            <a
              href={application.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-aurora-cyan hover:text-white group/link transition-colors bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-md"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </a>

            {/* Milestone Pill Selector */}
            <div className="relative">
              <select
                value={application.status}
                onChange={(e) => onStatusChange(application.id, e.target.value as Application['status'])}
                className="text-xs font-bold py-1.5 px-3 pr-7 rounded-xl border border-white/20 bg-slate-900/85 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-aurora-cyan cursor-pointer appearance-none hover:bg-slate-800 transition-colors backdrop-blur-md"
              >
                <option value="pending" className="bg-slate-900 text-white">⏳ Action Required</option>
                <option value="applied" className="bg-slate-900 text-white">📤 In Review</option>
                <option value="won" className="bg-slate-900 text-white">🏆 Laureate (Won)</option>
                <option value="rejected" className="bg-slate-900 text-white">❌ Concluded</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▾
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}