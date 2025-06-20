import React from 'react';
import { 
  Calendar, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy,
  Edit,
  Trash2,
  StickyNote
} from 'lucide-react';
import { Application } from '../lib/supabase';

interface ApplicationCardProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Application['status']) => void;
}

export function ApplicationCard({ application, onEdit, onDelete, onStatusChange }: ApplicationCardProps) {
  const statusColors = {
    applied: 'text-blue-600 bg-blue-100 border-blue-200',
    pending: 'text-amber-600 bg-amber-100 border-amber-200',
    won: 'text-emerald-600 bg-emerald-100 border-emerald-200',
    rejected: 'text-red-600 bg-red-100 border-red-200',
  };

  const statusIcons = {
    applied: CheckCircle,
    pending: Clock,
    won: Trophy,
    rejected: XCircle,
  };

  const StatusIcon = statusIcons[application.status];
  const deadline = new Date(application.deadline);
  const isOverdue = deadline < new Date() && application.status !== 'won' && application.status !== 'rejected';
  const daysUntilDeadline = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:shadow-lg transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            {application.title}
          </h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[application.status]}`}>
            <StatusIcon className="w-4 h-4 mr-1" />
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </div>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(application)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(application.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Deadline */}
      <div className="flex items-center mb-4">
        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
        <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
          {deadline.toLocaleDateString()}
          {!isOverdue && daysUntilDeadline >= 0 && (
            <span className="ml-2 text-xs text-gray-500">
              ({daysUntilDeadline === 0 ? 'Today' : `${daysUntilDeadline} days left`})
            </span>
          )}
          {isOverdue && <span className="ml-2 text-xs">(Overdue)</span>}
        </span>
      </div>

      {/* Submitted Date */}
      {application.submitted_at && (
        <div className="flex items-center mb-4">
          <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">
            Submitted {new Date(application.submitted_at).toLocaleDateString()}
          </span>
        </div>
      )}

      {/* Notes */}
      {application.notes && (
        <div className="mb-4">
          <div className="flex items-start">
            <StickyNote className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 line-clamp-3">
              {application.notes}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <a
          href={application.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          View Application
        </a>

        <select
          value={application.status}
          onChange={(e) => onStatusChange(application.id, e.target.value as Application['status'])}
          className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="applied">Applied</option>
          <option value="won">Won</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
}