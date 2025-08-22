# KPN Customer Management System

A full-stack customer management application built with Next.js, Drizzle ORM, PostgreSQL, and Tanstack Query.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun 1.0+
- Docker and Docker Compose

### Setup (5 minutes)

```bash
# 1. Install dependencies
bun install

# 2. Start database and setup
bun run db:start
bun run db:push
bun run db:seed

# 3. Start both apps
bun run dev
```

**Access:**

- Frontend: http://localhost:3001
- Backend: http://localhost:3000

## 🛠️ Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI, Tanstack Query
**Backend:** Next.js API Routes, Drizzle ORM, PostgreSQL, Zod validation
**Testing:** Playwright E2E tests
**Dev Tools:** Turbo monorepo, Bun package manager

## 📋 Available Commands

```bash
# Development
bun run dev              # Start both frontend and backend
bun run dev:web          # Start only frontend
bun run dev:server       # Start only backend
bun run build           # Build all applications

# Database
bun run db:start        # Start PostgreSQL
bun run db:stop         # Stop database
bun run db:studio       # Open database UI
bun run db:seed         # Add sample data

# Testing
cd apps/web && bun run test:e2e  # Run E2E tests
```

## 📚 Backend API

### Endpoints

| Method   | Endpoint              | Description         |
| -------- | --------------------- | ------------------- |
| `GET`    | `/api/customers`      | List all customers  |
| `POST`   | `/api/customers`      | Create new customer |
| `GET`    | `/api/customers/[id]` | Get customer by ID  |
| `PUT`    | `/api/customers/[id]` | Update customer     |
| `DELETE` | `/api/customers/[id]` | Delete customer     |

## 🎨 Frontend Features

**UI Components:**

- **Shadcn UI:** Card, Dialog, Form, Button, Input, Badge, etc.
- **Custom:** CustomerCard, CustomerFormModal, CustomerSearch, CustomerGrid

**Features:**

- Full CRUD operations for customers
- Real-time search and filtering
- Responsive design (Mobile: 320px+, Tablet: 768px+, Desktop: 1024px+)
- Form validation with React Hook Form
- Type-safe API integration

## 🧪 Testing

```bash
# Prerequisites
bun run db:start        # Start database
bun run db:seed         # Seed data
bun run dev:server      # Start backend

# Run tests
cd apps/web && bun run test:e2e
```

**Coverage:** CRUD operations, form validation, responsive design, error handling

## 🔧 Troubleshooting

```bash
# Database issues
bun run db:down && bun run db:start

# Port conflicts
lsof -i :3000 && lsof -i :3001

# API connection issues
curl http://localhost:3000/api/customers

# Clean install
rm -rf node_modules bun.lockb && bun install
```

## 📁 Project Structure

```
kpn/
├── apps/
│   ├── web/          # Frontend (Next.js + React)
│   │   ├── src/
│   │   │   ├── app/         # Next.js App Router pages
│   │   │   ├── components/  # React components
│   │   │   └── lib/         # Utilities and API client
│   │   └── package.json
│   └── server/       # Backend (Next.js API + PostgreSQL)
│       ├── src/
│       │   ├── app/api/     # API routes
│       │   ├── db/          # Database schema
│       │   └── services/    # Business logic
│       ├── docker-compose.yml
│       └── package.json
├── package.json      # Monorepo config
└── turbo.json        # Build system
```

## 📝 License

MIT
