import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Link2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  XCircle,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Application } from '../lib/supabase';

interface ApplicationModalProps {
  application?: Application | null;
  onSave: (data: Omit<Application, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
  onClose: () => void;
}

export function ApplicationModal({ application, onSave, onClose }: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    deadline: '',
    status: 'pending' as Application['status'],
    submitted_at: '',
    notes: '',
  });

  useEffect(() => {
    if (application) {
      setFormData({
        title: application.title,
        link: application.link,
        deadline: application.deadline,
        status: application.status,
        submitted_at: application.submitted_at ? application.submitted_at.split('T')[0] : '',
        notes: application.notes,
      });
    }
  }, [application]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      submitted_at: formData.submitted_at 
        ? new Date(formData.submitted_at).toISOString() 
        : formData.status === 'applied' 
          ? new Date().toISOString() 
          : null,
    });
  };

  const handleStatusSelect = (status: Application['status']) => {
    setFormData(prev => ({
      ...prev,
      status,
      submitted_at: status === 'applied' && !prev.submitted_at 
        ? new Date().toISOString().split('T')[0] 
        : prev.submitted_at
    }));
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="glass-card rounded-3xl shadow-glass-lg w-full max-w-lg max-h-[92vh] overflow-y-auto border border-white/90 relative">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-un-600 to-aurora-cyan flex items-center justify-center shadow-glow-un text-white flex-shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-un-600">
                SDG-4 Global Opportunity Dossier
              </div>
              <h2 className="text-xl font-bold font-display text-un-950">
                {application ? 'Edit Fellowship Record' : 'Register New Fellowship Opportunity'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Status Selection Cards */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Current Application Milestone *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleStatusSelect('pending')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all text-xs font-semibold ${
                  formData.status === 'pending'
                    ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-sm'
                    : 'border-slate-200/80 bg-white/70 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Action Required</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusSelect('applied')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all text-xs font-semibold ${
                  formData.status === 'applied'
                    ? 'border-un-400 bg-un-50 text-un-900 shadow-sm'
                    : 'border-slate-200/80 bg-white/70 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-un-500" />
                <span>Submitted / In Review</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusSelect('won')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all text-xs font-semibold ${
                  formData.status === 'won'
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-900 shadow-sm'
                    : 'border-slate-200/80 bg-white/70 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Trophy className="w-4 h-4 text-emerald-500" />
                <span>Awarded Laureate</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusSelect('rejected')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all text-xs font-semibold ${
                  formData.status === 'rejected'
                    ? 'border-slate-400 bg-slate-100 text-slate-800 shadow-sm'
                    : 'border-slate-200/80 bg-white/70 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4 text-slate-500" />
                <span>Concluded / Closed</span>
              </button>
            </div>
          </div>

          {/* Scholarship Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Scholarship / Fellowship Name *
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input text-slate-900 placeholder-slate-400 focus:outline-none"
                placeholder="e.g., Gates Millennium Scholarship"
              />
            </div>
          </div>

          {/* Application Portal URL */}
          <div>
            <label htmlFor="link" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Official Application Portal Link *
            </label>
            <div className="relative">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="link"
                type="url"
                required
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input text-slate-900 placeholder-slate-400 focus:outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Deadline & Submission Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="deadline" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Target Deadline *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="deadline"
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="submitted_at" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Date Submitted (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="submitted_at"
                  type="date"
                  value={formData.submitted_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, submitted_at: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Scholastic Notes & Essay Focus */}
          <div>
            <label htmlFor="notes" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Dossier Notes, Community Service Focus & Requirements
            </label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Highlight essay themes, recommendation letter status, or financial aid documentation..."
              className="w-full p-3 text-sm rounded-xl glass-input text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-un-600 to-un-500 hover:from-un-700 hover:to-un-600 text-white font-semibold text-sm shadow-md hover:shadow-glow-un transition-all duration-200 flex items-center gap-2"
            >
              <span>{application ? 'Update Record' : 'Save to Global Dossier'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}