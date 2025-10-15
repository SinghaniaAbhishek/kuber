💰 KUBER — Personal Finance Simplifier

“Master your money, don’t let it master you.” — Team Kuber 💚

A pastel-themed, gamified, and visually delightful personal finance web app built to make money management simple, beautiful, and stress-free.

Kuber empowers users to track, visualize, and celebrate their financial progress with an elegant dashboard and intuitive tools.

🧭 Overview

Managing money shouldn't be anxiety-inducing — it should feel rewarding.
KUBER helps users build healthier financial habits with features like expense tracking, savings goals, bill reminders, insights, and an on-page AI Assistant — all wrapped in a pastel, glassmorphic UI that radiates calm and confidence.

✨ Key Features
💸 Smart Expense & Budget Tracking

  Categorize and manage income and expenses
  Dynamic budget bar (turns yellow/red as limit nears)
  Clean visual summaries with pie & line charts

🎯 Savings Goal Visualizer

  Set financial goals and track progress visually
  Progress animations with confetti celebrations 🎉
  Unlockable badges for achievements

📅 Bills & Subscriptions

  Bill tracker with due date countdown
  Mark Paid → updates expense + advances due date
  Gentle color coded reminders

🤝 Debt & Split Tracker

  Tabs for “I Owe” and “Owed to Me”
  Simple settlement flows and optional sync with expenses

📊 Insights & Reports

  6-month trend charts (Income vs Expense)
  Category-wise heatmap visualization
  Animated counters for totals and comparisons

🧩 Budget Challenges

  Create monthly saving/spending challenges
  Live circular progress tracke
  Achievement badges: Smart Saver, Goal Getter, Bill Ninja 🏅

🤖 AI Assistant (On-Page) — NEW & IMPROVED

  Kuber includes a friendly AI Assistant that summarizes your finances, answers natural-language queries, and surfaces quick actions — designed to be helpful, private, and judge-friendly.

  Capabilities (sample queries):

    “Summarize my finances for Oct 2025.”
    “Show upcoming bills in the next 7 days.”
    “How much did I spend on subscriptions this month?”
    “Which goal is closest to completion?”

⚙️ Tech Stack
  🧩 Frontend
    Layer	Tech Used
    Framework	React (Vite + Hooks + Context API)
    Styling	Tailwind CSS (glassmorphic + pastel theme)
    Animations	Framer Motion
    Charts	Recharts
    Utilities	date-fns, papaparse
    TDeployment Vercel
  🧠 Backend
    Layer	Tech Used
    Framework	Node.js + Express
    Database	MongoDB (Mongoose ORM)
    API Auth	JWT (JSON Web Token)
    Scheduler	node-cron (for reminders)
    AI Summarizer	Local summarizer logic using data aggregation
    File Handling	Multer (for CSV import/export)
    Deployment	Railway (backend)

🧱 System Architecture
  Frontend (React + Tailwind)
      ↓ REST API (Axios)
  Backend (Node + Express)
      ↓
  MongoDB (Atlas / Local)


🧠 AI Summarizer Logic

  Reads from user’s financial data (income, expenses, goals, bills)
  Aggregates totals, identifies upcoming bills, and detects trends
  Generates structured natural text summaries


🗂️ Project Structure
src/
 ├── backend/
 │    ├── server.js
 │    ├── routes/
 │    │    ├── expenseRoutes.js
 │    │    ├── goalRoutes.js
 │    │    ├── billRoutes.js
 │    │    └── aiRoutes.js
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

🚀 Run Locally
Clone repo
git clone https://github.com/SinghaniaAbhishek/kuber.git
cd kuber

Install dependencies
npm install

Start backend
cd backend
npm start

Start frontend
cd frontend
npm run dev


🏆 Why KUBER Stands Out

🌈 Pastel-themed professional UI (eye-soothing + elegant)
🤖 AI summarizer for natural insights
🎮 Gamified finance with badges & confetti
📊 Live charts + analytics
🧩 Full-stack integration (React + Node + MongoDB)
💾 Persistent local & cloud data
📱 Responsive, accessible, and delightful UX

💚 Team KUBER
Building healthier financial habits — one pastel dashboard at a time.