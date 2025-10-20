💰 KUBER – Personal Finance Simplifier

“Master your money, don’t let it master you.” — Team Kuber 💚

A pastel-themed, gamified personal finance web app that turns anxiety into clarity.
Kuber helps users track, visualize, and celebrate their financial journey — all in one interactive dashboard.

🌍 Overview

Kuber simplifies money management through an elegant UI, goal tracking, reminders, and smart insights — empowering young professionals and freelancers to build healthy financial habits.

✨ Core Features
💸 Expense, Income & Budget Tracking

CRUD for income & expense

Category-based visualization (Food, Travel, Rent, etc.)

Budget progress bar updates live

🎯 Savings Goals

Create multiple goals (e.g., “Laptop Fund,” “Trip to Goa”)

Add savings → progress ring animation

🎉 Confetti + badges on completion

📅 Bill & Subscription Reminders

Auto alerts for upcoming bills

“Mark Paid” adds expense automatically

Smart recurring bill system

💬 AI Finance Assistant (Offline)

“Summarize my finances for this month.”
“Show me pending bills.”
“How much did I save this quarter?”

Works 100% offline (reads from local or MongoDB data)

Summarizes your income, spending, and goals in seconds

No external API needed — pure local summarizer logic

📊 Insights Dashboard

6-month trendline for Income vs Expense

Category pie chart

Spending activity heatmap

💪 Budget Challenge Mode

Create self-challenges (e.g., “Spend under ₹5,000 this month”)

Visual tracker + badges for success

⚙ Settings

Light 🌞 / Dark 🌙 / Dreamy 💫 themes

Export CSVs for expense, goals, and bills

Reset to mock data anytime

⚙ Tech Stack
🧩 Frontend
Layer	Tech Used
Framework	React (Vite + Hooks + Context API)
Styling	Tailwind CSS (Glassmorphic Pastel Theme)
Animations	Framer Motion
Charts	Recharts
Utilities	date-fns, papaparse
State Management	Context API
Persistence	localStorage + MongoDB sync
Testing	React Testing Library (optional)
🧠 Backend
Layer	Tech Used
Framework	Node.js + Express
Database	MongoDB (via Mongoose ORM)
Authentication	JWT
Scheduler	node-cron (Bill Reminder Jobs)
File Handling	Multer (CSV Import/Export)
AI Summarizer	Local data aggregation engine
Deployment	Render / Railway / Vercel
🧱 System Architecture
        ┌───────────────────────────────┐
        │           Frontend            │
        │  React + Tailwind + Recharts  │
        │  (Dashboard, Charts, Goals)   │
        └──────────────┬────────────────┘
                       │  Axios REST API
                       ▼
        ┌───────────────────────────────┐
        │            Backend            │
        │    Node.js + Express APIs     │
        │   /expenses /bills /goals     │
        │   /ai/summarize               │
        └──────────────┬────────────────┘
                       │  Mongoose
                       ▼
        ┌───────────────────────────────┐
        │           MongoDB             │
        │  Data: Expenses, Goals, Bills │
        │  AI reads for summaries       │
        └───────────────────────────────┘

🧩 AI Summarizer Logic
Input:

Pulls data from user’s income, expenses, goals & bills.

Processing:

Aggregates totals → detects upcoming bills → computes savings ratio.

Output:

Generates a structured natural summary:

📅 Monthly Snapshot — Oct 2025
💰 Income: ₹30,000
💸 Expenses: ₹6,950
💵 Net Savings: ₹23,050
🎯 Goals: Trip Fund 70% | Laptop 45%
📅 Bills: Netflix ₹499 (2 days), Rent ₹4,000 (5 days)
🏆 Challenge “Under ₹7000 Oct” — 92% completed!

🧾 Sample Mock Data
// src/data/mock.js
export const MOCK_DATA = {
  income: [
    { id: 1, source: "Freelance", amount: 15000, date: "2025-10-02" },
    { id: 2, source: "Part-time Job", amount: 12000, date: "2025-10-05" }
  ],
  expenses: [
    { id: 1, category: "Food", title: "Zomato", amount: 450, date: "2025-10-03" },
    { id: 2, category: "Bills", title: "Electricity", amount: 1800, date: "2025-10-07" }
  ],
  goals: [
    { id: 1, name: "Trip to Goa", target: 10000, saved: 7500 },
    { id: 2, name: "Laptop", target: 40000, saved: 10000 }
  ],
  bills: [
    { id: 1, name: "Netflix", amount: 499, due: "2025-10-18" },
    { id: 2, name: "WiFi", amount: 699, due: "2025-10-20" }
  ],
  challenges: [
    { id: 1, title: "Under ₹7000", limit: 7000, spent: 6450 }
  ]
};

🚀 Run Locally
# Clone repo
git clone https://github.com/yourusername/kuber.git
cd kuber

# Install dependencies
npm install

# Run backend
cd backend
npm start

# Run frontend
cd frontend
npm run dev


🪄 Open 👉 http://localhost:5173

🧩 App Structure
src/
 ├── backend/
 │    ├── server.js
 │    ├── routes/
 │    ├── controllers/
 │    ├── models/
 │    └── utils/
 ├── frontend/
 │    ├── components/
 │    ├── pages/
 │    ├── context/
 │    ├── data/mock.js
 │    └── App.jsx
 └── package.json

✅ Judge Checklist

✔ Dashboard, charts, and progress bars update instantly
✔ CRUD (Add/Edit/Delete) for income, expense, and goals
✔ “Mark Paid” → adds expense & resets due date
✔ AI assistant generates accurate summaries
✔ Confetti + badge trigger on goal completion
✔ CSV export + Reset to mock data works
✔ Fully responsive (mobile/tablet/desktop)

🏆 Why KUBER Wins

🌈 Eye-catching pastel & glassmorphic design
🤖 AI summarizer gives meaningful insights
🎮 Gamified with badges, challenges & confetti
📊 Live-updating charts & analytics
🧠 Intuitive UX for every user type
💾 Syncs local + cloud data seamlessly

💚 Team KUBER

Building healthier financial habits — one pastel dashboard at a time.
