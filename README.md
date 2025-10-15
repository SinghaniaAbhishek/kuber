💰 KUBER – Personal Finance Simplifier

The website is deployed.

A pastel-themed, gamified, AI-assisted finance dashboard for smarter money habits.

🧭 Overview

Kuber helps users take control of their money with beautiful visual dashboards, goal tracking, and an AI Assistant that summarizes your financial life.

✨ Features include:

💸 Income, Expense, and Budget Tracking

🎯 Goal Progress + Confetti Celebrations

📅 Bill & Subscription Reminders

🤖 On-page AI Finance Assistant

📊 Visual Insights & Challenges

📁 CSV Export + Offline LocalStorage persistence

⚙ Tech Stack
Layer	Tech Used
🧩 Frontend	React (Hooks + Context API)
💅 Styling	Tailwind CSS (pastel + glassmorphic aesthetic)
📈 Charts	Recharts (or Chart.js)
🎞 Animation	Framer Motion (for smooth transitions & confetti)
🗓 Date Utils	date-fns
📄 CSV	papaparse
💾 Persistence	localStorage (seeded with mock data)
💬 AI Assistant	Local summarizer (optional LLM integration)
🪄 UX Design Goals

✅ Soft pastel + professional color scheme (navy/charcoal text)
✅ Rounded corners + glassy cards + shadows
✅ Fully responsive (desktop / tablet / mobile)
✅ Friendly microcopy & emojis 😄
✅ Accessibility: Semantic HTML, labeled inputs, keyboard navigation

🧠 App Structure
src/
 ├── data/
 │    └── mock.js            # Seed data (MOCK_DATA)
 ├── context/
 │    └── DataProvider.jsx   # Central useData() hook
 ├── pages/
 │    ├── Dashboard.jsx
 │    ├── Expenses.jsx
 │    ├── Goals.jsx
 │    ├── Bills.jsx
 │    ├── Debts.jsx
 │    ├── Insights.jsx
 │    ├── Challenge.jsx
 │    └── Settings.jsx
 ├── components/
 │    ├── StatCard.jsx
 │    ├── AddExpenseModal.jsx
 │    ├── GoalConfetti.jsx
 │    ├── Charts/
 │    │    ├── PieChartView.jsx
 │    │    └── LineChartView.jsx
 │    └── AiAssistant.jsx
 ├── utils/
 │    └── format.js          # currency & date helpers
 ├── App.jsx
 └── index.jsx

🧾 Core Features
🏠 Dashboard

“Good evening, Abhishek — You’re doing great 💚”

Stat cards for Income, Expense, Net, Budget Remaining

Category pie chart + 3-month trend chart

Upcoming bills + Quick actions (Add Expense / Goal / Bill)

💰 Expense Tracker

Full CRUD (Add, Edit, Delete)

Table on desktop, cards on mobile

Budget progress bar updates live

🎯 Savings Goals

Track progress visually

Add to goal → trigger confetti 🎉

Earn badges upon completion

📅 Bills & Subscriptions

Days-left counter

“Mark Paid” → optionally auto-add expense + advance due date

🤝 Debt & Split Tracker

Tabs: I Owe / Owed to Me

Manage debts, mark paid, sync with expenses

📊 Insights

6-month Income vs Expense chart

Calendar heatmap / spend activity view

Animated counters: Spent / Saved / Remaining

🧩 Budget Challenge

Create personal monthly challenges

Track progress via ring chart

Badge rewards on success 🏅

⚙ Settings

Theme selector: Light / Dark / Dreamy 🌙

Export CSV for Expenses, Goals, Bills

Reset to mock data

🤖 AI Assistant

A friendly chatbot that summarizes your financial data — completely offline.

💡 Capabilities:

“Summarize my finances for Oct 2025”

“Show upcoming bills in next 7 days”

“How much did I spend on subscriptions?”

“Summarize my goals”

🧩 Implementation

Local summarizer reads from pfs_data in localStorage

Optional LLM integration (if desired via proxy)

Response cards with print / copy buttons

🧮 Example Response

Monthly Snapshot — Oct 2025

💰 Income: ₹28,000

💸 Expenses: ₹5,139

💵 Net: ₹22,861

🧾 Upcoming Bills: WiFi ₹699 (3 days), Electricity ₹1,800 (5 days)

🎯 Goals: Trip to Goa 75% • Laptop 25%

🏆 Challenge: “Under ₹5000 Oct” — 76% used

🪙 Badges: first-saver

🚀 Run Locally
git clone https://github.com/yourusername/kuber.git
cd kuber
npm install
npm start


🪄 Opens http://localhost:5173/ (Vite)

🧠 Judge Checklist

✅ App seeds localStorage correctly
✅ Dashboard stats & charts render properly
✅ Expense CRUD updates dashboard instantly
✅ Mark-Paid logic works (advance date + optional expense)
✅ Goal completion triggers confetti + badge
✅ CSV export downloads file
✅ Reset restores mock data
✅ AI Assistant summarizes accurately
✅ Responsive on desktop + mobile

🏆 Why KUBER Stands Out

🤖 AI summarization for human-like insights

🪄 Playful gamification (badges, confetti, challenges)

💡 Beautiful design + accessibility

📈 Live-updating visualizations


“Master your money, don’t let it master you.” — Team Kuber 💚