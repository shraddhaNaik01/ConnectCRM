# ConnectCRM — Customer Relationship Management & WooCommerce Integration

A modern, high-performance Customer Relationship Management (CRM) dark-themed web application tailored for e-commerce businesses to manage customer relationships, monitor order lifecycles, track sales follow-ups, and synchronize data seamlessly with WooCommerce.

---

## 🚀 Project Overview

**ConnectCRM** bridges the gap between storefront sales and customer relationship operations. Built for merchants, store managers, and sales teams who need a consolidated operational view of their WooCommerce store without granting direct WordPress administrative access to all team members.

### Core Objectives
- **Centralized Customer Directory:** Track customer lifetime value, order frequency, and contact records.
- **Order Visibility & Triage:** Monitor order states (completed, processing, pending, cancelled) with immediate access to total spend and line item count.
- **Interactive Visual Analytics:** Customer growth trends, monthly order counts, and order status donut distributions with dark theme styling.
- **Actionable Follow-ups:** Stay ahead of abandoned carts, VIP outreach, and customer support queries with due-date driven follow-up queues.
- **Bi-directional WooCommerce Sync:** Synchronize orders and customer data using WooCommerce REST API v3 and Webhooks.

---

## 🛠️ Technology Stack

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | [Next.js](https://nextjs.org/) (App Router, v14.2) | React framework with server/client components |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe domain models and UI contracts |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Enterprise dark-theme palette (#0B1120 background, #151F32 cards, #263449 borders) |
| **Visual Charts** | [Recharts](https://recharts.org/) | Responsive SVG charts (Customer Growth Area Chart, Order Analytics Bar Chart, Status Donut Chart) |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible vector icons |
| **Backend** *(Stage 2)* | [FastAPI](https://fastapi.tiangolo.com/) (Python) | High-performance asynchronous API endpoints |
| **Database** *(Stage 2)* | [PostgreSQL](https://www.postgresql.org/) + SQLAlchemy | Relational storage and ORM modeling |
| **Integration** *(Stage 2)* | WooCommerce REST API v3 | Storefront webhook ingestion and API sync |

---

## 📊 Development Status: Stage 1 Premium Dark Dashboard

- [x] **Workspace Inspection & Initialization:** Clean modular architecture created with clear separation for frontend and future backend services.
- [x] **Frontend Architecture:** Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide React, and Recharts configured.
- [x] **Design System & Layout:** 
  - Main background: Deep navy (`#0B1120`)
  - Sidebar: Dark navy (`#0F172A`) with active indicator bar and badges
  - Cards: Dark slate (`#151F32`)
  - Elevated surfaces: (`#1B2840`)
  - Borders: Subtle slate (`#263449`)
  - Primary accent: Vivid blue (`#60A5FA`), Violet (`#A78BFA`), Soft emerald (`#34D399`), Warm amber (`#FBBF24`)
  - Main text: Near-white (`#F1F5F9`), Muted text: Slate (`#94A3B8`)
- [x] **Interactive Dashboard Views:**
  - KPI Summary cards: *Total Customers*, *Total Orders*, *Pending Orders*, *Follow-ups Due*.
  - **Visual Analytics:**
    1. *Customer Growth Area Chart* (past 6 months)
    2. *Order Analytics Bar Chart* (monthly order counts and revenue)
    3. *Order Status Donut Chart* (completed, processing, pending, cancelled)
  - *Recent Orders Table* with status pills, responsive horizontally scrollable layout, and search/filter support.
  - *Follow-ups Due* priority queue.
  - *Recent Customer Activity* timeline.
  - Working CSV export utility and simulated sync state.
  - Consistent dark theme across all sub-pages: Customers, Orders, Follow-ups, and Integrations.
- [ ] **Stage 2 (Upcoming):** FastAPI backend setup, PostgreSQL database schema, SQLAlchemy models, and WooCommerce REST API v3 client.

---

## 💻 Local Development Setup (Windows)

### Prerequisites
- **Node.js** (v18.x or v20.x+ recommended; tested on Node.js v22.19)
- **npm** (v10+)

### 1. Clone the repository
```bash
git clone <repository-url>
cd Killowott
```

### 2. Navigate to frontend directory and install dependencies
```cmd
cd frontend
npm.cmd install
```

### 3. Run the development server
```cmd
npm.cmd run dev
```

### 4. Open in browser
Visit **[http://localhost:3000](http://localhost:3000)** in your browser to view the ConnectCRM dashboard.

---

## 🧪 Available Scripts

Inside the `frontend/` directory:
- `npm run dev` — Starts the Next.js local development server on port 3000.
- `npm run build` — Compiles and builds the production Next.js application.
- `npm run start` — Starts the Next.js production server.
- `npm run lint` — Runs ESLint to check for code standard conformance.

---

## 📁 Repository Structure

```
Killowott/
├── .gitignore                   # Root ignore rules for Git (credentials, dependencies, builds)
├── README.md                    # Project documentation & setup instructions
└── frontend/                    # Next.js frontend application
    ├── package.json             # Frontend dependencies & scripts
    ├── tsconfig.json            # TypeScript configuration
    ├── tailwind.config.ts       # Tailwind CSS dark theme design system tokens
    ├── postcss.config.mjs       # PostCSS configuration
    └── src/
        ├── app/                 # Next.js App Router pages and layouts
        │   ├── layout.tsx       # Root layout, metadata & fonts
        │   ├── globals.css      # Dark theme styling, root variables, scrollbars
        │   ├── page.tsx         # Dashboard overview page with charts & tables
        │   ├── customers/       # Customer directory page
        │   ├── orders/          # Orders list page
        │   ├── follow-ups/      # Customer follow-ups page
        │   └── integrations/    # WooCommerce integration settings page
        ├── components/
        │   ├── layout/          # DashboardLayout, Sidebar, Navbar
        │   └── dashboard/       # MetricCard, RecentOrdersTable, ActivityFeed,
        │                        # CustomerGrowthChart, OrderAnalyticsChart, OrderStatusDonutChart
        ├── data/                # Realistic demo datasets (metrics, charts, orders)
        └── types/               # TypeScript data models and interfaces
```

---

## 🔐 Security & Configuration Guidelines

- Do not commit `.env` or files containing WooCommerce Consumer Keys/Secrets.
- In production, all external API communications will be proxied through the authenticated FastAPI backend.
