import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

interface ApplicationPayload {
  title: string;
  link: string;
  deadline: string;
  status: 'applied' | 'pending' | 'won' | 'rejected';
  submitted_at?: string;
  notes?: string;
  user_id?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const url = new URL(req.url);
    const method = req.method;

    // POST /applications - Create new application (for Runner H)
    if (method === 'POST' && url.pathname === '/applications') {
      const body: ApplicationPayload = await req.json();

      // Validate required fields
      if (!body.title || !body.link || !body.deadline || !body.status) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: title, link, deadline, status' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Validate status enum
      const validStatuses = ['applied', 'pending', 'won', 'rejected'];
      if (!validStatuses.includes(body.status)) {
        return new Response(
          JSON.stringify({ error: 'Invalid status. Must be one of: applied, pending, won, rejected' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Set default user_id if not provided (for Runner H)
      const applicationData = {
        ...body,
        user_id: body.user_id || '00000000-0000-0000-0000-000000000000',
        submitted_at: body.submitted_at || (body.status === 'applied' ? new Date().toISOString() : null),
        notes: body.notes || '',
      };

      const { data, error } = await supabaseClient
        .from('applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to create application' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { 
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // GET /applications/summary - Get weekly summary (for email functionality)
    if (method === 'GET' && url.pathname === '/applications/summary') {
      const { data, error } = await supabaseClient
        .from('applications')
        .select('*')
        .order('deadline', { ascending: true });

      if (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch applications' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Group applications by status
      const summary = {
        applied: data.filter(app => app.status === 'applied'),
        pending: data.filter(app => app.status === 'pending'),
        won: data.filter(app => app.status === 'won'),
        rejected: data.filter(app => app.status === 'rejected'),
        total: data.length,
        upcoming_deadlines: data
          .filter(app => new Date(app.deadline) > new Date())
          .slice(0, 5)
      };

      return new Response(
        JSON.stringify(summary),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});