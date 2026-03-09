

# 💰 KUBER — Personal Finance Simplifier

> “Master your money, don’t let it master you.” — *Team Kuber 💚*

Kuber is a **pastel-themed, gamified personal finance web app** that transforms money anxiety into clarity.
Track, visualize, and celebrate your financial journey — all in one **interactive dashboard**.

---

## 🌍 Overview

**Kuber** simplifies money management through an elegant UI, smart insights, and habit-forming gamification.
Designed for **young professionals and freelancers**, it empowers users to manage income, expenses, savings goals, and bills effortlessly.

---

## ✨ Core Features

### 💸 Income, Expense & Budget Tracking

* CRUD operations for income and expense
* Category-based visualizations (Food, Travel, Rent, etc.)
* Live-updating budget progress bar

### 🎯 Savings Goals

* Create and manage multiple goals *(e.g., “Laptop Fund,” “Trip to Goa”)*
* Add savings and watch animated progress rings grow
* Confetti & badges celebrate goal completions 🎉

### 📅 Bill & Subscription Reminders

* Auto alerts for upcoming bills
* “Mark Paid” instantly adds expense and reschedules
* Smart recurring bill system

### 💬 Offline AI Finance Assistant

No APIs. No Internet. Pure logic.

Ask Kuber:

* “Summarize my finances for this month.”
* “Show me pending bills.”
* “How much did I save this quarter?”

💡 Works offline — reads local/MongoDB data to generate instant summaries.

### 📊 Insights Dashboard

* 6-month trendline for **Income vs Expense**
* Category-based pie chart
* Spending activity heatmap

### 💪 Budget Challenge Mode

* Create custom challenges *(e.g., “Spend under ₹5,000 this month”)*
* Visual progress tracker + badges for success

### ⚙ Settings

* Themes: **Light 🌞 / Dark 🌙 / Dreamy 💫**
* Export CSVs (expenses, goals, bills)
* Reset anytime to mock demo data

---

## ⚙️ Tech Stack

### 🧩 Frontend

| Layer       | Tech Used                                    |
| ----------- | -------------------------------------------- |
| Framework   | **React (Vite + Hooks + Context API)**       |
| Styling     | **Tailwind CSS (Glassmorphic Pastel Theme)** |
| Animations  | **Framer Motion**                            |
| Charts      | **Recharts**                                 |
| Utilities   | **date-fns, papaparse**                      |
| State       | **Context API**                              |
| Persistence | **localStorage + MongoDB Sync**              |
| Testing     | React Testing Library *(optional)*           |

### 🧠 Backend

| Layer          | Tech Used                      |
| -------------- | ------------------------------ |
| Framework      | **Node.js + Express**          |
| Database       | **MongoDB (Mongoose ORM)**     |
| Authentication | **JWT**                        |
| Scheduler      | **node-cron (Bill Reminders)** |
| File Handling  | **Multer (CSV Import/Export)** |
| AI Summarizer  | Local data aggregation engine  |
| Deployment     | Render / Railway / Vercel      |

---

## 🧱 System Architecture

```
 ┌───────────────────────────────┐
 │           Frontend            │
 │ React + Tailwind + Recharts   │
 │ (Dashboard, Charts, Goals)    │
 └──────────────┬────────────────┘
                │ Axios REST API
                ▼
 ┌───────────────────────────────┐
 │            Backend            │
 │ Node.js + Express + Mongoose  │
 │ /expenses /bills /goals /ai   │
 └──────────────┬────────────────┘
                │ Mongoose ORM
                ▼
 ┌───────────────────────────────┐
 │            MongoDB            │
 │ Expenses • Goals • Bills Data │
 │ AI Summarizer reads locally   │
 └───────────────────────────────┘
```

---

## 🧩 AI Summarizer Logic

**Input:**
Pulls data from income, expenses, goals & bills.

**Processing:**
Aggregates totals → detects upcoming bills → calculates savings ratio.

**Output Example:**

```
📅 Monthly Snapshot — Oct 2025
💰 Income: ₹30,000
💸 Expenses: ₹6,950
💵 Net Savings: ₹23,050
🎯 Goals: Trip Fund 70% | Laptop 45%
📅 Bills: Netflix ₹499 (2 days), Rent ₹4,000 (5 days)
🏆 Challenge “Under ₹7000 Oct” — 92% completed!
```

---

## 🧾 Sample Mock Data

`src/data/mock.js`

```js
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
```

---

## 🚀 Run Locally

```bash
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
```

🪄 Open [http://localhost:5173](http://localhost:5173)

---

## 🧩 App Structure

```
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
```

---

## ✅ Project Checklist

✔ Real-time dashboard & charts
✔ CRUD for income, expenses & goals
✔ Smart “Mark Paid” feature for bills
✔ Offline AI summarizer with natural summaries
✔ Confetti & badges for achievements
✔ CSV export & reset mock data
✔ 100% responsive across devices

---

## 🏆 Why Kuber Stands Out

🌈 Pastel & glassmorphic UI design
🤖 Offline AI summarizer with contextual insights
🎮 Gamified — badges, confetti & challenges
📊 Interactive charts and analytics
💾 Hybrid persistence (local + cloud)
🧠 Intuitive, beginner-friendly UX

---

## 💚 Team KUBER
