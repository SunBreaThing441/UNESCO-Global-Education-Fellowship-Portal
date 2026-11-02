# Frontend Workflow Specification: Kaizen (UNESCO SDG-4)

Kaizen is a modern single-page web application built with **React 18**, **TypeScript**, **Tailwind CSS (Aura-UN Design System)**, and bundled with **Vite**. Re-engineered from the ground up as a global social service solution aligned with **UNESCO Sustainable Development Goal 4 (Ensure inclusive and equitable quality education)**.

---

## 1. Frontend Architecture Overview

```mermaid
graph TD
    Index["index.html (Google Fonts: Plus Jakarta Sans & Space Grotesk)"] --> Main["src/main.tsx"]
    Main --> App["src/App.tsx (Aura-UN Atmospheric Shell)"]
    
    subgraph Auth_State ["Authentication Boundary (useAuth)"]
        App -->|Not Authenticated| AuthForm["src/components/AuthForm.tsx\n- Dual-Pane Mission Pavilion\n- SDG-4 Verification Badges\n- Instant Demo Gateway"]
        App -->|Authenticated| Dashboard["src/components/Dashboard.tsx\n- Global Navigation Header\n- SDG-4 Live Indicator\n- Hero Analytics Command Center\n- Priority Deadline Radar"]
    end

    subgraph Dashboard_Components ["Workspace Component Structure"]
        Dashboard --> HeroMetrics["Hero Analytics (4 Frosted Glass KPI Cards)"]
        Dashboard --> DeadlineRadar["Priority Deadline Radar (Urgent Action Alerts)"]
        Dashboard --> ControlBar["Search Filter & View Array (⌘K Hint, Status Buttons)"]
        Dashboard --> CardGrid["OpportunityCard Grid (src/components/ApplicationCard.tsx)"]
        Dashboard --> Modal["Dossier Dialog (src/components/ApplicationModal.tsx)"]
    end

    subgraph State_And_Data ["Data & Services Layer (Preserved Backend)"]
        useAuth["src/hooks/useAuth.ts"]
        useApps["src/hooks/useApplications.ts"]
        SupabaseClient["src/lib/supabase.ts"]
    end

    AuthForm -.-> useAuth
    Dashboard -.-> useAuth
    Dashboard -.-> useApps
    useAuth -.-> SupabaseClient
    useApps -.-> SupabaseClient
    SupabaseClient --> BackendAPI["Local Backend Engine (:3001)"]
```

---

## 2. Replaced Component Hierarchy & Upgrades

| Component | File Path | Major Upgrades in Rebrand |
| :--- | :--- | :--- |
| **Atmospheric Root** | `src/App.tsx` | Futuristic UN orbital spinner loading screen, atmospheric cyan/blue radial gradients, Space Grotesk font styling. |
| **Global Auth Portal** | `src/components/AuthForm.tsx` | Dual-pane layout: Left pane showcases UNESCO SDG-4 mission briefing, international impact metrics ($45M+ in verified opportunities), and zero-cost open access protocol. Right pane provides one-click instant demo login and scholar registration. |
| **Kaizen Dashboard** | `src/components/Dashboard.tsx` | Global top navigation with UNESCO badge, 4 frosted glass KPI command cards, **Priority Deadline Radar** banner for urgent deadlines, multi-field search with quick clear, and interactive filter pills. |
| **Opportunity Card** | `src/components/ApplicationCard.tsx` | Double-layered frosted acrylic glass (`glass-card glass-card-hover`), dynamic top status accent glow strip, live deadline countdown chips ("Overdue", "Due Today!", "X days left"), and quick milestone switcher. |
| **Opportunity Modal** | `src/components/ApplicationModal.tsx` | Glassmorphic floating dossier dialog with interactive 4-status milestone selector cards, formatted date pickers, link validator, and scholastic notes textarea. |

---

## 3. Aura-UN Design Tokens

- **UN Blue Spectrum:**
  - `un-500` (`#0077D4`): Authentic core UNESCO / UN Blue.
  - `un-600` (`#005FB8`) to `un-950` (`#051324`): Deep international navy palette.
  - `aurora-cyan` (`#00E5FF`): Luminescent accent glow.
- **Glassmorphism Physics:**
  - `glass-card`: `rgba(255, 255, 255, 0.78)` backdrop blur with specular white edge borders.
  - `glass-nav`: `backdrop-blur-2xl` floating navigation header.
  - `glass-input`: Translucent inputs with dynamic blue focus rings.

---

## 4. Execution Commands

```bash
# Frontend development server (Port 5173)
cd ScholarTrack
npm run dev

# Compile TypeScript & production bundle
npm run build
```
