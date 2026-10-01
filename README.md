# THE NEWS — Multilingual Digital News Platform (Phase 1)

> **Phase Status:** Phase 1 (Technical Foundation, Design System, Responsive Shells, Dev Infrastructure, Backend Foundation)  
> **Target Audience:** Modern digital journalism client with mobile-first readership and desktop editorial workflows.

---

## 1. Project Overview

**The News** is a production-quality digital news platform engineered for independent journalism. It combines an authoritative, restrained digital newsroom aesthetic with a scalable, type-safe full-stack foundation.

This repository represents the **Phase 1 release**. In this phase, the technical foundation, responsive application shells, design system, database connectivity, and administrative framework have been established. Business logic, full database models, CRUD operations, authentication, and media uploads are explicitly reserved for subsequent phases.

---

## 2. High-Level Architecture

The project maintains independent deployability for frontend and backend:

```text
TheNews/
├── frontend/             # React 18 + Vite + TypeScript (Client SPA)
│   ├── src/
│   │   ├── components/   # UI primitives, editorial cards, layouts
│   │   ├── hooks/        # Theme toggle & React Query health hooks
│   │   ├── pages/        # Public newsroom & Admin CMS shells
│   │   ├── routes/       # React Router central routing table
│   │   ├── services/     # Centralized API client & isolated mock data
│   │   ├── types/        # TypeScript contracts & interfaces
│   │   ├── App.tsx       # QueryClient & Toast providers
│   │   ├── main.tsx      # DOM mount & strict mode
│   │   └── index.css     # Tailwind CSS & editorial typography
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/              # Node.js + Express + TypeScript + Mongoose
│   ├── src/
│   │   ├── config/       # Environment parsing (Zod) & MongoDB connection
│   │   ├── controllers/  # Health diagnostic controller
│   │   ├── middleware/   # Central error handling, 404, rate limiting
│   │   ├── routes/       # Versioned API routes (/api/v1)
│   │   ├── utils/        # Structured logging
│   │   ├── app.ts        # Express app assembly & security headers
│   │   └── server.ts     # Process bootstrap & graceful shutdown
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── .gitignore            # Root ignore rules for node_modules, .env, dist
└── README.md
```

### Production Deployment Targets
- **Frontend SPA:** Vercel
- **Backend API:** Render
- **Database:** MongoDB Atlas

---

## 3. Technology Stack

### Frontend
- **Framework & Bundler:** React 18, Vite 6, TypeScript
- **Styling:** Tailwind CSS (Custom editorial palette: Deep Navy `#0B1F3A`, Warm Red Accent `#C2413B`, responsive breakpoints `320px`–`1920px`)
- **Routing:** React Router v6 (`createBrowserRouter`, nested layouts)
- **Data Fetching:** TanStack Query v5 (`@tanstack/react-query`)
- **Forms & Validation:** React Hook Form + Zod
- **Icons:** Lucide React

### Backend
- **Runtime & Web Framework:** Node.js, Express.js, TypeScript
- **Database Driver:** Mongoose (MongoDB)
- **Security:** Helmet, CORS, express-rate-limit
- **Validation:** Zod
- **Logging:** Structured JSON/timestamp logger & Morgan HTTP logger

---

## 4. Environment Variables

### Frontend (`frontend/.env`)
```bash
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000/api/v1
```
*(Reference: `frontend/.env.example`)*

### Backend (`backend/.env`)
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/the_news
CLIENT_URL=http://localhost:5173
```
*(Reference: `backend/.env.example`)*

> **Security Note:** Real `.env` files are ignored by git and never committed to source control.

---

## 5. Local Setup & Running

### Prerequisites
- **Node.js:** v18+ (tested on Node v24.18.0)
- **MongoDB:** Local MongoDB instance running on `localhost:27017` or a MongoDB Atlas URI

### Step 1: Backend Setup
```bash
cd backend
npm install
npm run build
npm run dev      # Runs with tsx watcher on http://localhost:5000
# or for production:
npm start        # Runs compiled code from dist/server.js
```

Verify backend health:
```bash
curl http://localhost:5000/api/v1/health
```

Expected JSON response:
```json
{
  "success": true,
  "message": "The News API is running",
  "environment": "development",
  "timestamp": "2026-09-30T...",
  "database": {
    "status": "connected",
    "connected": true,
    "name": "the_news"
  }
}
```

### Step 2: Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

To verify production compilation:
```bash
npm run build    # Compiles TypeScript and builds production bundles in frontend/dist/
```

---

## 6. Frontend Routes Established in Phase 1

### Public Newsroom Shell
- `/` — Homepage (Breaking ticker, Hero story, Continuous Wire, Most Read, Desks showcase, Newsletter card)
- `/category/:slug` — Desk view (Lead story, Article grid, Pagination foundation)
- `/article/:slug` — Editorial article layout (Byline, Deck, Pull quotes, Verified badge, Tags, Reader discussion placeholder)
- `/search` — Archive search (Query inputs, Desk filters, Result cards, Empty state, Pagination foundation)
- `/login` — Journalist & subscriber login placeholder card
- `/register` — Reader account registration placeholder
- `/forgot-password` — Password recovery placeholder
- `*` — Editorial 404 page

### Admin CMS Shell
- `/admin` — CMS Dashboard (Metric counters, Recent dispatches table, Most viewed dispatches, System health monitor, Activity audit)
- `/admin/posts` — Articles & dispatches module shell
- `/admin/posts/new` — Compose dispatch placeholder (TipTap editor slot)
- `/admin/posts/bulk` — Batch ingestion placeholder
- `/admin/media` — Media library placeholder
- `/admin/categories` — Desk & taxonomy management shell
- `/admin/tags` — Tagging management shell
- `/admin/languages` — Multilingual localization shell
- `/admin/comments` — Reader discussion moderation shell
- `/admin/polls` — Editorial polling shell
- `/admin/users` — Staff & subscriber accounts shell
- `/admin/homepage` — Homepage layout curation shell
- `/admin/homepage/featured` — Top stories curation shell
- `/admin/homepage/breaking` — Breaking news ticker management shell
- `/admin/homepage/sections` — Section reordering shell
- `/admin/analytics` — Audience telemetry shell
- `/admin/settings/general` — General publication settings
- `/admin/settings/seo` — Search engine optimization settings
- `/admin/settings/navigation` — Navigation architecture settings
- `/admin/settings/social` — Syndication & social feeds settings
- `/admin/settings/account` — Journalist profile settings

---

## 7. Reusable UI Primitives (`frontend/src/components/ui`)
- `Button` (Primary, Secondary, Outline, Ghost, Destructive; sizes sm/md/lg; loading state)
- `Input` & `Textarea` (Editorial labels, icons, error handling)
- `Select` & `Checkbox` & `Switch` (Accessible form controls)
- `Badge` (Category, Breaking pulse, Success, Warning, Outline)
- `Card` (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- `Modal` (Dialog with light dismiss, escape key close, backdrop blur)
- `Dropdown` & `Tooltip` (Interactive overlays with keyboard/mouse support)
- `Tabs` (Underline tabs with badge counters)
- `Table` (Accessible responsive table with header, row, cell)
- `Avatar` (Image with fallback initials and user icon)
- `Skeleton` (Animated placeholders for text and containers)
- `Alert` & `Toast` (Notification context and toast provider)
- `Spinner` (Accessible SVG loader)
- `EmptyState` & `ErrorState` (Illustrated fallback states with retry actions)

---

## 8. Dark Mode Implementation
- Supported via Tailwind `class` mode.
- Synchronized with `color-scheme` CSS property on `:root` and `html`.
- Persisted in browser `localStorage` (`the_news_theme`).
- Zero-flashing (FOUC) prevention script loaded inline in `index.html`.
- Accessible toggles available in both Public and Admin navigation headers.

---

## 9. End-to-End System Diagnostic Indicator
A live diagnostic pill (`API: Online (DB Connected)`) is embedded in both the public and admin navigation bars. Powered by TanStack Query, it continuously queries `GET /api/v1/health` and provides a click-to-view diagnostic modal detailing:
- Backend Express API status
- MongoDB connection state & database name
- Server environment
- Real-time timestamp & latency
