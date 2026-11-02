# ScholarTrack System Workflows

This document serves as the master navigation index for all technical workflow definitions in the ScholarTrack codebase.

---

## 📂 Workflow Documentation Files

| Component | Workflow File | Topics Covered |
| :--- | :--- | :--- |
| 🖥️ **Frontend** | [FRONTEND_WORKFLOW.md](workflows/FRONTEND_WORKFLOW.md) | React component tree, `useAuth` & `useApplications` state hooks, Tailwind CSS styling, user interactions, Vite dev & production build |
| ⚙️ **Backend** | [BACKEND_WORKFLOW.md](workflows/BACKEND_WORKFLOW.md) | Node.js / Supabase Edge Functions, Runner H agent endpoint (`POST /applications`), weekly summary endpoint (`GET /applications/summary`), REST PostgREST compatibility |
| 🗄️ **Database** | [DATABASE_WORKFLOW.md](workflows/DATABASE_WORKFLOW.md) | Database schema (`applications`), PostgreSQL migrations, Row Level Security (RLS) policies, JSON file persistence (`data/applications.json`), seed data |
| 📑 **Index & Architecture** | [README.md](workflows/README.md) | Unified end-to-end architecture diagram, quick start commands, and operational procedures |

---

## ⚡ Quick Operational Commands

```bash
# Frontend dev server (Port 5173)
npm run dev

# Backend API server (Port 3001)
npm run server

# Build production frontend
npm run build
```
