import { useState, useEffect, useCallback } from 'react';
import { supabase, backendApi, Application, ApplicationSummary } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<ApplicationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  // Clear any existing error state
  const clearError = useCallback(() => setError(null), []);

  /**
   * Fetch Weekly Summary from GET /applications/summary
   */
  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      const data = await backendApi.getWeeklySummary();
      setSummary(data);
    } catch (err) {
      console.warn('Weekly summary integration notice:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  /**
   * Fetch Applications via GET /rest/v1/applications
   */
  const fetchApplications = useCallback(async () => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch user-owned applications: GET /rest/v1/applications?user_id=eq.{id}
      const { data: userApps, error: userError } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('deadline', { ascending: true });

      if (userError) throw userError;

      // 2. Fallback to demo applications if user has not registered any: GET /rest/v1/applications?user_id=is.null
      if (!userApps || userApps.length === 0) {
        const { data: demoApps, error: demoError } = await supabase
          .from('applications')
          .select('*')
          .is('user_id', null)
          .order('deadline', { ascending: true });

        if (demoError) throw demoError;
        setApplications(demoApps || []);
      } else {
        setApplications(userApps);
      }

      // Parallel integration with the Weekly Summary API
      await fetchSummary();

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve scholarship applications';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user, fetchSummary]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  /**
   * Create Application: POST /rest/v1/applications
   */
  const createApplication = async (
    applicationData: Omit<Application, 'id' | 'created_at' | 'updated_at' | 'user_id'>
  ) => {
    if (!user) return { data: null, error: 'Unauthorized: User not authenticated' };

    try {
      setActionLoading(true);
      setError(null);

      const payload = {
        ...applicationData,
        user_id: user.id,
      };

      const { data, error: insertError } = await supabase
        .from('applications')
        .insert([payload])
        .select()
        .single();

      if (insertError) throw insertError;

      setApplications(prev => [...prev, data]);
      fetchSummary(); // Refresh global telemetry
      return { data, error: null };
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : 'Error creating scholarship record';
      setError(errMessage);
      return { data: null, error: errMessage };
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Update Application: PATCH /rest/v1/applications?id=eq.{id}
   */
  const updateApplication = async (id: string, updates: Partial<Application>) => {
    try {
      setActionLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setApplications(prev => prev.map(app => (app.id === id ? data : app)));
      fetchSummary(); // Refresh global telemetry
      return { data, error: null };
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : 'Error updating scholarship milestone';
      setError(errMessage);
      return { data: null, error: errMessage };
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Delete Application: DELETE /rest/v1/applications?id=eq.{id}
   */
  const deleteApplication = async (id: string) => {
    try {
      setActionLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setApplications(prev => prev.filter(app => app.id !== id));
      fetchSummary(); // Refresh global telemetry
      return { error: null };
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : 'Error removing scholarship opportunity';
      setError(errMessage);
      return { error: errMessage };
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Claim Demo Data: PATCH /rest/v1/applications?user_id=is.null
   */
  const claimDemoData = async () => {
    if (!user) return { error: 'Unauthorized: User not authenticated' };

    try {
      setActionLoading(true);
      setError(null);

      const { error: claimError } = await supabase
        .from('applications')
        .update({ user_id: user.id })
        .is('user_id', null);

      if (claimError) throw claimError;

      // Reload fresh state directly from backend
      await fetchApplications();
      return { error: null };
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : 'Error claiming demonstration fellowships';
      setError(errMessage);
      return { error: errMessage };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    applications,
    summary,
    loading,
    summaryLoading,
    actionLoading,
    error,
    clearError,
    createApplication,
    updateApplication,
    deleteApplication,
    claimDemoData,
    refetch: fetchApplications,
    refetchSummary: fetchSummary,
  };
}