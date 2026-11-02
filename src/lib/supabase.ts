import { createClient } from '@supabase/supabase-js';

// Base backend and API URL configuration
export const BACKEND_URL = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:3001';
export const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvY2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDQ2NDUsImV4cCI6MjA2NjAyMDY0NX0.ghKeW6mUbSWACzYcvGNDjpvdWTeV0fxdTPvNefVgDig';

export const supabase = createClient(BACKEND_URL, ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: window.localStorage,
  },
  global: {
    headers: {
      'x-client-info': 'kaizen-web/1.0.0',
    },
  },
});

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string;
          title: string;
          link: string;
          deadline: string;
          status: 'applied' | 'pending' | 'won' | 'rejected';
          submitted_at: string | null;
          notes: string;
          created_at: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          link: string;
          deadline: string;
          status: 'applied' | 'pending' | 'won' | 'rejected';
          submitted_at?: string | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          link?: string;
          deadline?: string;
          status?: 'applied' | 'pending' | 'won' | 'rejected';
          submitted_at?: string | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
        };
      };
    };
  };
};

export type Application = Database['public']['Tables']['applications']['Row'];

export interface ApplicationSummary {
  applied: Application[];
  pending: Application[];
  won: Application[];
  rejected: Application[];
  total: number;
  upcoming_deadlines: Array<Application | { id: string; title: string; deadline: string; status: Application['status'] }>;
}

/**
 * Direct Backend REST API Helpers (Port 3001)
 */
export const backendApi = {
  /**
   * GET /applications/summary - Retrieve weekly summary for analytics
   */
  async getWeeklySummary(): Promise<ApplicationSummary> {
    const res = await fetch(`${BACKEND_URL}/applications/summary`, {
      headers: {
        'Accept': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch weekly summary: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * POST /applications - Runner H agent ingestion endpoint
   */
  async submitRunnerHApplication(payload: Omit<Application, 'id' | 'created_at' | 'updated_at'>): Promise<Application> {
    const res = await fetch(`${BACKEND_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to submit via Runner H endpoint');
    }
    return result.data;
  },

  /**
   * GET /health - Check server connectivity
   */
  async checkHealth(): Promise<{ status: string; totalApplications: number }> {
    const res = await fetch(`${BACKEND_URL}/health`);
    if (!res.ok) throw new Error('Backend health check failed');
    return res.json();
  },
};