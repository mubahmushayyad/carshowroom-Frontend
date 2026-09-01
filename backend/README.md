# U Devs Car Showroom — Backend

Express + Sequelize + PostgreSQL API for the Admin → Users Redux module,
built per U Devs' *Backend + Frontend + Redux Engineering Guide*.

```
React UI → Redux Toolkit → Axios → Express Routes → Middleware
→ Controllers → Sequelize Models → PostgreSQL
```

## Structure
```
backend/
├── src/
│   ├── config/db.js            Sequelize connection
│   ├── models/userModel.js     User model (id, name, email, role, status, createdAt)
│   ├── controllers/
│   │   ├── userController.js   CRUD logic, { success, message, data, errors } responses
│   │   └── authController.js   Optional JWT register/login/logout
│   ├── routes/
│   │   ├── userRoutes.js       GET/POST /api/users, PUT/DELETE /api/users/:id
│   │   └── authRoutes.js       POST /api/auth/register|login|logout
│   ├── middleware/
│   │   ├── authMiddleware.js   isAuthenticated / allowRoles (JWT)
│   │   └── errorMiddleware.js  Centralized error handling
│   ├── seeders/seedUsers.js    Seeds the 4 demo accounts on first run
│   ├── app.js                  Express app: CORS, JSON, routes
│   └── server.js               DB connect → sync → seed → listen
├── .env.example
└── package.json
```

## Setup

```bash
cp .env.example .env
```

Edit `.env`:
```
DB_NAME=udevs_carshowroom
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=use_a_long_random_secret
FRONTEND_URL=http://localhost:5173
```

Create the database:
```bash
createdb -U postgres udevs_carshowroom
# or create "udevs_carshowroom" in pgAdmin
```

Install and run:
```bash
npm install
npm run dev
```

On first boot the server connects, runs `sequelize.sync()`, and — if the
`users` table is empty — seeds the same 4 demo accounts the mock API used
(`admin@udevs.com`, `sales@udevs.com`, `inventory@udevs.com`,
`customer@udevs.com`), each with its matching demo password from the main
README, bcrypt-hashed.

## API contract

All responses: `{ success, message, data, errors }`.

| Method | Endpoint | Body | Notes |
|---|---|---|---|
| GET | `/api/health` | — | Health check |
| GET | `/api/users` | — | List users (password excluded) |
| GET | `/api/users/:id` | — | Single user |
| POST | `/api/users` | `{ name, email, role, status }` | 409 on duplicate email |
| PUT | `/api/users/:id` | `{ name?, email?, role?, status? }` | 409 on duplicate email |
| DELETE | `/api/users/:id` | — | Returns `{ id }` |
| POST | `/api/auth/register` | `{ name, email, password, role? }` | Optional, hashes password |
| POST | `/api/auth/login` | `{ email, password }` | Returns `{ token, user }` |
| POST | `/api/auth/logout` | — | Stateless (client discards token) |

Valid `role` values: `Admin`, `Sales Manager`, `Inventory Manager`, `Customer`.
Valid `status` values: `Active`, `Inactive`.

## Testing quickly

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/users
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@udevs.com","role":"Customer","status":"Active"}'
```

Or just run the frontend (`npm run dev` in the project root) with
`VITE_API_URL=http://localhost:5000/api` in its `.env` and use Admin → Users.

## Notes / production checklist
- Uses `sequelize.sync()` for convenience; swap for real migrations before production.
- CORS is locked to `FRONTEND_URL`.
- Passwords are always bcrypt-hashed and excluded from every JSON response.
- Add rate limiting to `/api/auth/*` before any real deployment.
