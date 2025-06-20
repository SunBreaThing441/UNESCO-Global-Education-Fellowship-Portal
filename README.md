# ScholarTrack - Scholarship Management System

A comprehensive full-stack web application for tracking and managing scholarship applications, featuring an AI agent interface for automated submissions.

## 🌟 Live Demo

**Production URL:** [https://scholartrack-production.netlify.app](https://scholartrack-production.netlify.app)

**Demo Credentials:**
- Email: `demo@scholartrack.com`
- Password: `demo123456`

## ✨ Features

### Frontend Dashboard
- **Beautiful, responsive interface** with modern glassmorphism design
- **Authentication system** with email/password login and demo account support
- **Application management** - create, edit, delete, and track applications
- **Advanced filtering and sorting** by status, deadline, and date added
- **Real-time statistics** showing application counts by status
- **Upcoming deadlines** widget with visual warnings
- **Demo data claiming** - new users can claim sample data as their own
- **Mobile-first responsive design** that works on all devices

### Backend API
- **REST API endpoint** (`POST /applications`) for Runner H agent submissions
- **Supabase database** with comprehensive application tracking
- **Row Level Security (RLS)** for secure data access
- **Weekly summary endpoint** (`GET /applications/summary`) for email reports
- **Real-time data synchronization** between frontend and backend

### Database Schema
- **applications table** with fields:
  - `title` - Scholarship name
  - `link` - Application URL
  - `deadline` - Application deadline
  - `status` - Current status (pending, applied, won, rejected)
  - `submitted_at` - Submission timestamp
  - `notes` - Additional notes and reminders
  - `user_id` - Associated user for data isolation (nullable for demo data)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd scholartrack
   npm install
   ```

2. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key from Settings > API
   - Run the migrations in the `supabase/migrations` folder

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Add your Supabase URL and anon key to .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Use demo credentials: `demo@scholartrack.com` / `demo123456`

## 📡 API Documentation

### Runner H Agent Endpoint

**POST** `/functions/v1/applications`

Submit new scholarship applications programmatically.

**Headers:**
```
Authorization: Bearer {SUPABASE_ANON_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Gates Millennium Scholarship",
  "link": "https://www.gatesfoundation.org/scholarships",
  "deadline": "2024-12-15",
  "status": "applied",
  "submitted_at": "2024-11-01T10:30:00Z",
  "notes": "Strong essay focusing on community service",
  "user_id": "optional-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Gates Millennium Scholarship",
    "status": "applied",
    "created_at": "2024-11-01T10:30:00Z"
  }
}
```

### Weekly Summary Endpoint

**GET** `/functions/v1/applications/summary`

Retrieve weekly summary for email reports.

**Response:**
```json
{
  "applied": [...],
  "pending": [...],
  "won": [...],
  "rejected": [...],
  "total": 15,
  "upcoming_deadlines": [...]
}
```

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for development and building

### Backend
- **Supabase** for database, authentication, and API
- **PostgreSQL** with Row Level Security
- **Edge Functions** for API endpoints
- **Real-time subscriptions** for live updates

### Design System
- **Modern glassmorphism** with backdrop blur effects
- **Gradient backgrounds** and subtle animations
- **Professional color palette** with blue and emerald accents
- **Consistent 8px spacing system**
- **Responsive breakpoints** for all screen sizes

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AuthForm.tsx    # Login/signup interface
│   ├── Dashboard.tsx   # Main dashboard view
│   ├── ApplicationCard.tsx  # Individual application cards
│   └── ApplicationModal.tsx # Add/edit modal
├── hooks/              # Custom React hooks
│   ├── useAuth.ts     # Authentication management
│   └── useApplications.ts  # Application data management
├── lib/               # Utilities and configuration
│   └── supabase.ts   # Supabase client and types
└── App.tsx           # Root application component

supabase/
├── migrations/        # Database migrations
└── functions/        # Edge functions for API
```

## 🔧 Key Features Implementation

- **Authentication Flow**: Secure email/password auth with Supabase
- **Demo Account System**: Instant access with sample data
- **Data Claiming**: Users can claim demo data as their own
- **Real-time Updates**: Live data sync using Supabase subscriptions
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Error Handling**: Comprehensive error states and user feedback
- **Performance**: Optimized queries and efficient state management

## 🚀 Deployment

The application is configured for easy deployment:

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automatically on git push

### Manual Build
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## 🔐 Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. For deployment issues, check your Supabase configuration

## 🎯 Roadmap

- [ ] Email notifications for upcoming deadlines
- [ ] Document upload and attachment support
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] Integration with scholarship databases
- [ ] AI-powered application recommendations

---

Built with ❤️ using React, TypeScript, Tailwind CSS, and Supabase.