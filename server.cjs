const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'applications.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial seed applications matching supabase migrations
const initialApplications = [
  {
    id: 'f1a2b3c4-1111-4000-8000-000000000001',
    title: 'Gates Millennium Scholarship',
    link: 'https://www.gatesfoundation.org/scholarships',
    deadline: '2024-12-15',
    status: 'applied',
    submitted_at: '2024-11-01T10:30:00.000Z',
    notes: 'Strong essay submitted focusing on community service and leadership experience.',
    created_at: new Date('2024-11-01T10:30:00.000Z').toISOString(),
    updated_at: new Date('2024-11-01T10:30:00.000Z').toISOString(),
    user_id: null
  },
  {
    id: 'f1a2b3c4-2222-4000-8000-000000000002',
    title: 'National Merit Scholarship',
    link: 'https://www.nationalmerit.org/',
    deadline: '2024-11-30',
    status: 'pending',
    submitted_at: null,
    notes: 'Waiting for PSAT scores to be released. Need to submit additional documentation.',
    created_at: new Date('2024-10-15T09:00:00.000Z').toISOString(),
    updated_at: new Date('2024-10-15T09:00:00.000Z').toISOString(),
    user_id: null
  },
  {
    id: 'f1a2b3c4-3333-4000-8000-000000000003',
    title: 'Coca-Cola Scholars Program',
    link: 'https://www.coca-colascholarsfoundation.org/',
    deadline: '2024-10-31',
    status: 'won',
    submitted_at: '2024-09-15T14:20:00.000Z',
    notes: 'Received $20,000 scholarship! Interview went extremely well.',
    created_at: new Date('2024-09-15T14:20:00.000Z').toISOString(),
    updated_at: new Date('2024-09-15T14:20:00.000Z').toISOString(),
    user_id: null
  },
  {
    id: 'f1a2b3c4-4444-4000-8000-000000000004',
    title: 'Dell Scholars Program',
    link: 'https://www.dellscholars.org/',
    deadline: '2024-12-01',
    status: 'rejected',
    submitted_at: '2024-10-01T09:15:00.000Z',
    notes: 'Did not meet GPA requirements. Will reapply next year.',
    created_at: new Date('2024-10-01T09:15:00.000Z').toISOString(),
    updated_at: new Date('2024-10-01T09:15:00.000Z').toISOString(),
    user_id: null
  },
  {
    id: 'f1a2b3c4-5555-4000-8000-000000000005',
    title: 'Jack Kent Cooke Foundation Scholarship',
    link: 'https://www.jkcf.org/our-scholarships/',
    deadline: '2024-11-25',
    status: 'applied',
    submitted_at: '2024-10-20T16:45:00.000Z',
    notes: 'Comprehensive application with financial aid documentation submitted.',
    created_at: new Date('2024-10-20T16:45:00.000Z').toISOString(),
    updated_at: new Date('2024-10-20T16:45:00.000Z').toISOString(),
    user_id: null
  },
  {
    id: 'f1a2b3c4-6666-4000-8000-000000000006',
    title: 'QuestBridge National College Match',
    link: 'https://www.questbridge.org/',
    deadline: '2024-12-10',
    status: 'pending',
    submitted_at: null,
    notes: 'Application in progress. Need to complete college rankings.',
    created_at: new Date('2024-10-25T11:00:00.000Z').toISOString(),
    updated_at: new Date('2024-10-25T11:00:00.000Z').toISOString(),
    user_id: null
  },
  {
    id: 'f1a2b3c4-7777-4000-8000-000000000007',
    title: 'Hispanic Scholarship Fund',
    link: 'https://www.hsf.net/',
    deadline: '2024-12-31',
    status: 'applied',
    submitted_at: '2024-11-10T11:30:00.000Z',
    notes: 'Submitted application with community involvement emphasis.',
    created_at: new Date('2024-11-10T11:30:00.000Z').toISOString(),
    updated_at: new Date('2024-11-10T11:30:00.000Z').toISOString(),
    user_id: null
  },
  {
    id: 'f1a2b3c4-8888-4000-8000-000000000008',
    title: 'Elks National Foundation Most Valuable Student',
    link: 'https://www.elks.org/scholars/',
    deadline: '2024-11-20',
    status: 'pending',
    submitted_at: null,
    notes: 'Waiting for school counselor recommendation letter.',
    created_at: new Date('2024-10-05T08:00:00.000Z').toISOString(),
    updated_at: new Date('2024-10-05T08:00:00.000Z').toISOString(),
    user_id: null
  }
];

let applications = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    applications = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    applications = [...initialApplications];
    saveData();
  }
} else {
  applications = [...initialApplications];
  saveData();
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(applications, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

// User accounts database
const users = [
  {
    id: 'd3b07384-d113-494b-9c84-123456789abc',
    email: 'demo@scholartrack.com',
    password: 'demo123456',
    created_at: '2024-01-01T00:00:00.000Z'
  }
];

function generateJwt(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: 'supabase',
    ref: 'local',
    sub: user.id,
    email: user.email,
    role: 'authenticated',
    aud: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 30
  })).toString('base64url');
  const signature = 'local-signature';
  return `${header}.${payload}.${signature}`;
}

function buildUserResponse(user) {
  const token = generateJwt(user);
  return {
    access_token: token,
    token_type: 'bearer',
    expires_in: 3600 * 24 * 30,
    refresh_token: `rt_${user.id}`,
    user: {
      id: user.id,
      aud: 'authenticated',
      role: 'authenticated',
      email: user.email,
      email_confirmed_at: '2024-01-01T00:00:00.000Z',
      phone: '',
      confirmed_at: '2024-01-01T00:00:00.000Z',
      last_sign_in_at: new Date().toISOString(),
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: {},
      identities: [],
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data, extraHeaders = {}) {
  const responseData = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer, range',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Expose-Headers': 'content-range, prefer',
    ...extraHeaders
  });
  res.end(responseData);
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer, range',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method;

  // 1. Health check & API root
  if (pathname === '/' || pathname === '/api' || pathname === '/health') {
    return sendJson(res, 200, {
      status: 'online',
      name: 'ScholarTrack Backend API',
      version: '1.0.0',
      totalApplications: applications.length,
      timestamp: new Date().toISOString(),
      endpoints: [
        'POST /applications',
        'GET /applications/summary',
        'POST /functions/v1/applications',
        'GET /functions/v1/applications/summary',
        'GET /applications',
        '/auth/v1/token',
        '/auth/v1/signup',
        '/rest/v1/applications'
      ]
    });
  }

  // 2. Auth Endpoints
  if (pathname === '/auth/v1/token' && method === 'POST') {
    const body = await parseBody(req);
    const { email, password } = body;
    let user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    
    // If demo login or valid user
    if (user && user.password === password) {
      return sendJson(res, 200, buildUserResponse(user));
    }
    
    // Auto-create or allow demo
    if (email === 'demo@scholartrack.com' && password === 'demo123456') {
      user = {
        id: 'd3b07384-d113-494b-9c84-123456789abc',
        email: 'demo@scholartrack.com',
        password: 'demo123456',
        created_at: new Date().toISOString()
      };
      users.push(user);
      return sendJson(res, 200, buildUserResponse(user));
    }

    return sendJson(res, 400, { error: 'invalid_grant', error_description: 'Invalid login credentials' });
  }

  if (pathname === '/auth/v1/signup' && method === 'POST') {
    const body = await parseBody(req);
    const { email, password } = body;
    if (!email || !password) {
      return sendJson(res, 400, { error: 'Email and password required' });
    }
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return sendJson(res, 400, { message: 'User already registered', error_description: 'User already registered' });
    }
    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    return sendJson(res, 200, buildUserResponse(newUser));
  }

  if (pathname === '/auth/v1/logout' && method === 'POST') {
    return sendJson(res, 200, {});
  }

  if (pathname === '/auth/v1/user' && method === 'GET') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    let userId = null;
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
        userId = payload.sub;
      }
    } catch (e) {}

    const user = users.find(u => u.id === userId) || users[0];
    return sendJson(res, 200, buildUserResponse(user).user);
  }

  // 3. Supabase REST API for Applications: /rest/v1/applications
  if (pathname === '/rest/v1/applications') {
    const isSingle = (req.headers['accept'] || '').includes('vnd.pgrst.object+json');

    // GET /rest/v1/applications
    if (method === 'GET') {
      const userIdParam = url.searchParams.get('user_id');
      const idParam = url.searchParams.get('id');
      const orderParam = url.searchParams.get('order');

      let filtered = [...applications];

      if (idParam) {
        const idVal = idParam.replace(/^eq\./, '');
        filtered = filtered.filter(a => a.id === idVal);
      } else if (userIdParam) {
        if (userIdParam === 'is.null') {
          filtered = filtered.filter(a => a.user_id === null || a.user_id === undefined);
        } else if (userIdParam.startsWith('eq.')) {
          const uid = userIdParam.replace(/^eq\./, '');
          filtered = filtered.filter(a => a.user_id === uid);
        }
      }

      if (orderParam) {
        if (orderParam.startsWith('deadline')) {
          filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        } else if (orderParam.startsWith('created_at')) {
          filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
      }

      if (isSingle) {
        if (filtered.length === 0) {
          return sendJson(res, 404, { error: 'Not found' });
        }
        return sendJson(res, 200, filtered[0], { 'content-range': '0-0/1' });
      }

      return sendJson(res, 200, filtered, {
        'content-range': `0-${Math.max(0, filtered.length - 1)}/${filtered.length}`
      });
    }

    // POST /rest/v1/applications
    if (method === 'POST') {
      const body = await parseBody(req);
      const items = Array.isArray(body) ? body : [body];
      const createdItems = [];

      for (const item of items) {
        const newApp = {
          id: item.id || crypto.randomUUID(),
          title: item.title,
          link: item.link,
          deadline: item.deadline,
          status: item.status || 'pending',
          submitted_at: item.submitted_at || (item.status === 'applied' ? new Date().toISOString() : null),
          notes: item.notes || '',
          user_id: item.user_id || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        applications.push(newApp);
        createdItems.push(newApp);
      }
      saveData();

      if (isSingle || !Array.isArray(body)) {
        return sendJson(res, 201, createdItems[0]);
      }
      return sendJson(res, 201, createdItems);
    }

    // PATCH /rest/v1/applications
    if (method === 'PATCH') {
      const body = await parseBody(req);
      const userIdParam = url.searchParams.get('user_id');
      const idParam = url.searchParams.get('id');

      let updatedItems = [];

      if (idParam && idParam.startsWith('eq.')) {
        const idVal = idParam.replace(/^eq\./, '');
        const target = applications.find(a => a.id === idVal);
        if (target) {
          Object.assign(target, body, { updated_at: new Date().toISOString() });
          updatedItems.push(target);
        }
      } else if (userIdParam === 'is.null') {
        // Claim demo data
        applications.forEach(a => {
          if (a.user_id === null || a.user_id === undefined) {
            Object.assign(a, body, { updated_at: new Date().toISOString() });
            updatedItems.push(a);
          }
        });
      }
      saveData();

      if (isSingle) {
        return sendJson(res, 200, updatedItems[0] || {});
      }
      return sendJson(res, 200, updatedItems);
    }

    // DELETE /rest/v1/applications
    if (method === 'DELETE') {
      const idParam = url.searchParams.get('id');
      if (idParam && idParam.startsWith('eq.')) {
        const idVal = idParam.replace(/^eq\./, '');
        const idx = applications.findIndex(a => a.id === idVal);
        if (idx !== -1) {
          applications.splice(idx, 1);
          saveData();
        }
      }
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
      });
      return res.end();
    }
  }

  // 4. Runner H & Edge Function Endpoints:
  // POST /applications or /functions/v1/applications
  if ((pathname === '/applications' || pathname === '/functions/v1/applications') && method === 'POST') {
    const body = await parseBody(req);

    if (!body.title || !body.link || !body.deadline || !body.status) {
      return sendJson(res, 400, {
        error: 'Missing required fields: title, link, deadline, status'
      });
    }

    const validStatuses = ['applied', 'pending', 'won', 'rejected'];
    if (!validStatuses.includes(body.status)) {
      return sendJson(res, 400, {
        error: 'Invalid status. Must be one of: applied, pending, won, rejected'
      });
    }

    const newApp = {
      id: crypto.randomUUID(),
      title: body.title,
      link: body.link,
      deadline: body.deadline,
      status: body.status,
      submitted_at: body.submitted_at || (body.status === 'applied' ? new Date().toISOString() : null),
      notes: body.notes || '',
      user_id: body.user_id || '00000000-0000-0000-0000-000000000000',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    applications.push(newApp);
    saveData();

    return sendJson(res, 201, {
      success: true,
      data: newApp
    });
  }

  // GET /applications/summary or /functions/v1/applications/summary
  if ((pathname === '/applications/summary' || pathname === '/functions/v1/applications/summary') && method === 'GET') {
    const sorted = [...applications].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    const summary = {
      applied: sorted.filter(app => app.status === 'applied'),
      pending: sorted.filter(app => app.status === 'pending'),
      won: sorted.filter(app => app.status === 'won'),
      rejected: sorted.filter(app => app.status === 'rejected'),
      total: sorted.length,
      upcoming_deadlines: sorted.filter(app => new Date(app.deadline) > new Date()).slice(0, 5)
    };
    return sendJson(res, 200, summary);
  }

  // GET /applications (List all applications)
  if (pathname === '/applications' && method === 'GET') {
    return sendJson(res, 200, applications);
  }

  // Fallback 404
  return sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`ScholarTrack Backend API server running on http://localhost:${PORT}`);
  console.log(`Endpoints available:`);
  console.log(`  - Root/Health:  http://localhost:${PORT}/`);
  console.log(`  - Runner H API: POST http://localhost:${PORT}/applications`);
  console.log(`  - Summary API:  GET http://localhost:${PORT}/applications/summary`);
  console.log(`  - Edge Fn API:  http://localhost:${PORT}/functions/v1/applications`);
  console.log(`  - REST API:     http://localhost:${PORT}/rest/v1/applications`);
  console.log(`  - Auth API:     http://localhost:${PORT}/auth/v1/token`);
});
