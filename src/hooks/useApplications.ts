import { useState, useEffect } from 'react';
import { supabase, Application } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchApplications = async () => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // First, try to get user's own applications
      const { data: userApps, error: userError } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('deadline', { ascending: true });

      if (userError) throw userError;

      // If user has no applications, also fetch demo applications (user_id IS NULL)
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

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const createApplication = async (applicationData: Omit<Application, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([{
          ...applicationData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setApplications(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { data: null, error };
    }
  };

  const updateApplication = async (id: string, updates: Partial<Application>) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setApplications(prev => 
        prev.map(app => app.id === id ? data : app)
      );
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { data: null, error };
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => prev.filter(app => app.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { error };
    }
  };

  const claimDemoData = async () => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Update all demo applications (user_id IS NULL) to belong to current user
      const { error } = await supabase
        .from('applications')
        .update({ user_id: user.id })
        .is('user_id', null);

      if (error) throw error;

      // Refresh the applications list
      await fetchApplications();
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { error };
    }
  };

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    claimDemoData,
    refetch: fetchApplications,
  };
}