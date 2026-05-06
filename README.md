<<<<<<< HEAD
# SkillBridge Attendance Management System

A full-stack, role-based attendance management platform for state-level skilling programmes.

---

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| Frontend | _Deploy to Vercel — see deployment section_ |
| Backend API | _Deploy to Railway/Render — see deployment section_ |

---

## 👥 User Roles

| Role | Description |
|------|-------------|
| **Student** | Views sessions, marks attendance, joins batches via invite code |
| **Trainer** | Creates sessions, manages attendance, generates invite links |
| **Institution** | Manages batches, assigns trainers, views batch summaries |
| **Programme Manager** | Oversees all institutions, creates programmes, views aggregate reports |
| **Monitoring Officer** | Read-only access to all programme-wide data |

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite, React Router v6, Clerk (auth), Recharts
- **Backend**: Node.js + Express, Prisma ORM
- **Database**: PostgreSQL (Neon recommended)
- **Authentication**: Clerk

---

## 📁 Project Structure

```
skillbridge/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   └── src/
│       ├── config/                # DB, Clerk, env config
│       ├── controllers/           # Route handlers
│       ├── middleware/            # Auth, role, error middleware
│       ├── models/                # Prisma query helpers
│       ├── routes/                # Express routers
│       ├── services/              # Business logic
│       └── utils/                 # Validators, invite code generator
└── frontend/
    └── src/
        ├── api/                   # Axios API calls
        ├── components/            # Reusable UI components (by role)
        ├── context/               # AuthContext (Clerk + backend sync)
        ├── hooks/                 # useAuth hook
        ├── pages/                 # Role-specific dashboards
        ├── routes/                # AppRoutes + ProtectedRoute
        └── utils/                 # Role helpers, constants
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon free tier)
- Clerk account (free tier)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**backend/.env**
```env
DATABASE_URL="postgresql://user:password@host:5432/skillbridge"
CLERK_SECRET_KEY="sk_test_..."
FRONTEND_URL="http://localhost:5173"
PORT=5000
NODE_ENV=development
```

**frontend/.env**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:5000/api
```

### 3. Set Up Clerk

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Copy your **Publishable Key** → `VITE_CLERK_PUBLISHABLE_KEY`
3. Copy your **Secret Key** → `CLERK_SECRET_KEY`
4. In Clerk Dashboard → Configure → Allowed redirect URLs: add `http://localhost:5173`

### 4. Set Up Database

```bash
cd backend
npx prisma db push        # Push schema to database
npx prisma generate       # Generate Prisma client
```

### 5. Seed Initial Data (Optional)

Create at least one institution via the Programme Manager role, or run:

```bash
# Using Prisma Studio
npx prisma studio
```

### 6. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000  
Health check: http://localhost:5000/health

---

## 🧪 Test Accounts

After deploying, create accounts with these roles for testing:

| Role | Email | Notes |
|------|-------|-------|
| Programme Manager | manager@test.com | Create institutions first |
| Institution Admin | institution@test.com | Select institution on signup |
| Trainer | trainer@test.com | Select institution on signup |
| Student | student@test.com | Select institution on signup |
| Monitoring Officer | monitoring@test.com | No institution needed |

**Recommended test flow:**
1. Sign up as **Programme Manager** → Create an institution
2. Sign up as **Institution Admin** → Select the institution → Create a batch
3. Sign up as **Trainer** → Select the institution → Get assigned to batch
4. Sign up as **Student** → Select the institution → Join batch with invite code
5. Trainer creates a session and opens it
6. Student marks attendance

---

## 🌐 Deployment

### Backend (Railway / Render)

1. Push code to GitHub
2. Connect repo to Railway or Render
3. Set environment variables in the dashboard
4. Set build command: `npm install && npx prisma generate`
5. Set start command: `npm start`

### Frontend (Vercel)

1. Connect repo to Vercel
2. Set root directory to `frontend`
3. Set environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_API_URL` (your backend URL)
4. Deploy

### Database (Neon)

1. Create a free PostgreSQL database at [neon.tech](https://neon.tech)
2. Copy the connection string to `DATABASE_URL`
3. Run `npx prisma db push` to create tables

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/sync` | Public | Sync Clerk user to DB |
| GET | `/api/auth/profile` | Any | Get current user profile |
| GET | `/api/auth/institutions` | Public | List all institutions |
| GET | `/api/batches` | Any | Get batches (role-filtered) |
| POST | `/api/batches` | Institution/Manager | Create batch |
| POST | `/api/batches/join` | Student | Join batch via invite code |
| GET | `/api/sessions` | Any | Get sessions (role-filtered) |
| POST | `/api/sessions` | Trainer | Create session |
| PATCH | `/api/sessions/:id/toggle` | Trainer | Toggle session active |
| POST | `/api/attendance/mark` | Student | Mark own attendance |
| POST | `/api/attendance/bulk` | Trainer | Bulk mark attendance |
| GET | `/api/attendance/session/:id` | Trainer+ | Get session attendance |
| GET | `/api/attendance/my` | Student | Get own attendance summary |
| GET | `/api/institutions/batch/:id/summary` | Institution+ | Batch summary |
| GET | `/api/programmes/summary` | Manager/Monitoring | Programme-wide summary |

---

## 🔐 Security

- All routes (except `/api/auth/sync` and `/api/auth/institutions`) require a valid Clerk JWT
- Role-based middleware enforces access at the API level
- Students can only mark their own attendance
- Trainers can only manage their own sessions
- Institution admins can only manage their own institution's data

---

## 📄 License

MIT
=======
# SkillBridge
SkillBridge
>>>>>>> 197c12741a5f470995a28cd44c3f3989e9e588d7
