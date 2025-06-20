import React, { useState } from 'react';
import { 
  Filter, 
  Plus, 
  Calendar, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy,
  SortAsc,
  Search,
  GraduationCap,
  LogOut,
  Download
} from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import { useAuth } from '../hooks/useAuth';
import { Application } from '../lib/supabase';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationModal } from './ApplicationModal';

export function Dashboard() {
  const { applications, loading, createApplication, updateApplication, deleteApplication, claimDemoData } = useApplications();
  const { user, signOut } = useAuth();
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'status' | 'created_at'>('deadline');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [claimingData, setClaimingData] = useState(false);

  const statusColors = {
    applied: 'text-blue-600 bg-blue-100',
    pending: 'text-amber-600 bg-amber-100',
    won: 'text-emerald-600 bg-emerald-100',
    rejected: 'text-red-600 bg-red-100',
  };

  const statusIcons = {
    applied: CheckCircle,
    pending: Clock,
    won: Trophy,
    rejected: XCircle,
  };

  const filteredApplications = applications
    .filter(app => {
      if (filter !== 'all' && app.status !== filter) return false;
      if (searchTerm && !app.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
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

  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'applied').length,
    pending: applications.filter(app => app.status === 'pending').length,
    won: applications.filter(app => app.status === 'won').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  const upcomingDeadlines = applications
    .filter(app => new Date(app.deadline) > new Date() && app.status !== 'won' && app.status !== 'rejected')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  // Check if user is viewing demo data (applications with user_id = null)
  const isViewingDemoData = applications.length > 0 && applications.some(app => app.user_id === null);

  const handleCreateApplication = async (data: Omit<Application, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    await createApplication(data);
    setShowModal(false);
  };

  const handleUpdateApplication = async (data: Omit<Application, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (editingApplication) {
      await updateApplication(editingApplication.id, data);
      setEditingApplication(null);
      setShowModal(false);
    }
  };

  const handleEditApplication = (application: Application) => {
    setEditingApplication(application);
    setShowModal(true);
  };

  const handleDeleteApplication = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      await deleteApplication(id);
    }
  };

  const handleClaimDemoData = async () => {
    setClaimingData(true);
    const { error } = await claimDemoData();
    if (error) {
      alert('Failed to claim demo data: ' + error);
    }
    setClaimingData(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg mr-3">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">ScholarTrack</h1>
                  <p className="text-sm text-gray-600">Welcome back, {user?.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Data Banner */}
        {isViewingDemoData && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-900">You're viewing demo data</h3>
                  <p className="text-sm text-blue-700">
                    These are sample scholarship applications. Click "Claim Demo Data" to make them yours and start editing.
                  </p>
                </div>
              </div>
              <button
                onClick={handleClaimDemoData}
                disabled={claimingData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 disabled:opacity-50"
              >
                {claimingData ? 'Claiming...' : 'Claim Demo Data'}
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.applied}</p>
                <p className="text-sm text-gray-600">Applied</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Trophy className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.won}</p>
                <p className="text-sm text-gray-600">Won</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        {upcomingDeadlines.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-amber-600" />
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {upcomingDeadlines.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{app.title}</p>
                    <p className="text-sm text-gray-600">
                      Due: {new Date(app.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search scholarships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="applied">Applied</option>
                    <option value="pending">Pending</option>
                    <option value="won">Won</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <SortAsc className="w-5 h-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'deadline' | 'status' | 'created_at')}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="deadline">Sort by Deadline</option>
                    <option value="status">Sort by Status</option>
                    <option value="created_at">Sort by Date Added</option>
                  </select>
                </div>

                {/* Add Button */}
                <button
                  onClick={() => {
                    setEditingApplication(null);
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Application</span>
                </button>
              </div>
            </div>

            {/* Applications Grid */}
            {filteredApplications.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-12 border border-white/20 text-center">
                <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Start by adding your first scholarship application'}
                </p>
                <button
                  onClick={() => {
                    setEditingApplication(null);
                    setShowModal(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition duration-200"
                >
                  Add Your First Application
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onEdit={handleEditApplication}
                    onDelete={handleDeleteApplication}
                    onStatusChange={(id, status) => updateApplication(id, { status })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <ApplicationModal
          application={editingApplication}
          onSave={editingApplication ? handleUpdateApplication : handleCreateApplication}
          onClose={() => {
            setShowModal(false);
            setEditingApplication(null);
          }}
        />
      )}
    </div>
  );
}