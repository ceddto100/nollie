# Full-Stack Portfolio + Blog + Admin CMS

A complete full-stack tutorial project with four public data-driven pages and a
hidden admin panel for content management. **Zero hardcoded content** — every
piece of visible data comes from MongoDB via API calls.

## Tech Stack

| Layer     | Technology                                     |
| --------- | ---------------------------------------------- |
| Frontend  | React 18, React Router v6, Tailwind CSS, Vite  |
| Backend   | Node.js, Express, Mongoose, JWT, bcrypt         |
| Database  | MongoDB                                        |
| Deploy    | Render.com                                     |

## Project Structure

```
├── client/                 React frontend (Vite)
│   └── src/
│       ├── components/     Reusable UI (Layout, Button, Skeleton, NetworkBackground)
│       ├── hooks/          useApi — shared fetch wrapper
│       ├── pages/          Blog, Projects, Resume, Services
│       │   └── admin/      Login, Dashboard, Blog/Project/Resume/Services Managers
│       └── utils/          API URL helpers
├── server/                 Express API
│   ├── models/             Mongoose schemas (Post, Project, Resume, Service)
│   ├── routes/             REST endpoints (posts, projects, resume, services, auth)
│   ├── middleware/         JWT auth, error handler
│   ├── seed.js             Sample data seeder
│   └── index.js            Server entry point
├── .env.example            Environment variable template
├── render.yaml             Render deployment config
└── README.md
```

## Quick Start

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and admin credentials
```

To generate a bcrypt hash for your admin password:

```bash
node -e "require('bcrypt').hash('your_password', 10).then(h => console.log(h))"
```

### 3. Seed the database

```bash
npm run seed
```

### 4. Start development

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Public Pages

| Route            | Description                           |
| ---------------- | ------------------------------------- |
| `/blog`          | Blog posts listing                    |
| `/blog/:slug`    | Single post with Markdown rendering   |
| `/projects`      | Project portfolio with status filters |
| `/resume`        | Resume with experience, education, skills |
| `/services`      | Service offerings with pricing        |

## Admin Panel

The admin login is accessed via a subtle gear icon in the footer.

| Route               | Description            |
| -------------------- | --------------------- |
| `/admin/login`       | Admin authentication  |
| `/admin/dashboard`   | Management hub        |
| `/admin/blog`        | Blog post CRUD        |
| `/admin/projects`    | Project CRUD          |
| `/admin/resume`      | Resume section editor |
| `/admin/services`    | Services CRUD         |

## API Endpoints

### Auth
- `POST /api/auth/login` — Login, returns JWT
- `POST /api/auth/logout` — Logout acknowledgement
- `GET  /api/auth/me` — Verify token

### Posts
- `GET    /api/posts` — Published posts (public)
- `GET    /api/posts/all` — All posts (admin)
- `GET    /api/posts/:slug` — Single post (public)
- `POST   /api/posts` — Create (admin)
- `PUT    /api/posts/:id` — Update (admin)
- `DELETE /api/posts/:id` — Delete (admin)

### Projects
- `GET    /api/projects` — All projects (public)
- `GET    /api/projects/:id` — Single project (public)
- `POST   /api/projects` — Create (admin)
- `PUT    /api/projects/:id` — Update (admin)
- `DELETE /api/projects/:id` — Delete (admin)

### Resume
- `GET    /api/resume` — Full resume (public)
- `PUT    /api/resume/:section` — Update section (admin)

### Services
- `GET    /api/services` — All services (public)
- `GET    /api/services/:id` — Single service (public)
- `POST   /api/services` — Create (admin)
- `PUT    /api/services/:id` — Update (admin)
- `DELETE /api/services/:id` — Delete (admin)

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=bcrypt_hash_here
VITE_API_URL=http://localhost:5000
```

## Deployment

Configured for Render.com via `render.yaml`. See the file for service definitions.
