import React, { useState, useEffect } from 'react';
import { X, Calendar, Link as LinkIcon, FileText, Tag } from 'lucide-react';
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
      submitted_at: formData.submitted_at ? new Date(formData.submitted_at).toISOString() : null,
    });
  };

  const handleStatusChange = (status: Application['status']) => {
    setFormData(prev => ({
      ...prev,
      status,
      submitted_at: status === 'applied' && !prev.submitted_at 
        ? new Date().toISOString().split('T')[0] 
        : prev.submitted_at
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {application ? 'Edit Application' : 'Add New Application'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Scholarship Title *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Gates Millennium Scholarship"
                required
              />
            </div>
          </div>

          {/* Link */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
              Application Link *
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://..."
                required
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
              Application Deadline *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleStatusChange(e.target.value as Application['status'])}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="applied">Applied</option>
                <option value="won">Won</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Submitted Date */}
          {(formData.status === 'applied' || formData.status === 'won' || formData.status === 'rejected') && (
            <div>
              <label htmlFor="submitted_at" className="block text-sm font-medium text-gray-700 mb-2">
                Submitted Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="submitted_at"
                  type="date"
                  value={formData.submitted_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, submitted_at: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Add any additional notes, requirements, or reminders..."
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition duration-200"
            >
              {application ? 'Update' : 'Create'} Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}