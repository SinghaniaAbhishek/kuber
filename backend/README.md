Personal Finance Simplifier - Backend
====================================

Setup
-----

1. Install dependencies:

```
npm install
```

2. Create a `.env` file with:

```
MONGO_URI=
JWT_SECRET=devsecret
PORT=5000
```

3. Run in development:

```
npm run dev
```

4. Seed mock data (optional):

```
npm run seed
```

API
---

- Base URL: `http://localhost:5000/api`
- Docs: `http://localhost:5000/api/docs`

Auth
----

- POST `/api/auth/signup`
- POST `/api/auth/login`
- GET `/api/auth/me` (Bearer token required)

Core Resources
--------------

- `/api/income` CRUD
- `/api/expenses` CRUD
- `/api/goals` CRUD (+ update saves triggers `goal-completed` badge)
- `/api/bills` CRUD + `PATCH /mark-paid/:id`
- `/api/subscriptions` CRUD + `PATCH /mark-paid/:id`
- `/api/debts` CRUD + `PATCH /mark-paid/:id`
- `/api/challenges` CRUD (auto-updated on expense creation)
- `/api/badges` GET/POST
- `/api/dashboard/stats`, `/api/dashboard/charts`
- `/api/insights/income-vs-expense`, `/api/insights/activity`
- `/api/settings/theme` GET/PUT, `/api/settings/budget` GET/PUT, `/api/settings/reset-data` POST, `/api/settings/export` GET
- `/api/assistant/summary` POST

Frontend Connection
-------------------

- Set `REACT_APP_API_URL=http://localhost:5000/api` in frontend `.env`
- Replace localStorage calls with `fetch`/`axios` to these endpoints
- Keep a mock mode toggle to switch back to local data


