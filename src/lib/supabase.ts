import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

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
          user_id: string;
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
          user_id?: string;
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
          user_id?: string;
        };
      };
    };
  };
};

export type Application = Database['public']['Tables']['applications']['Row'];