export const MOCK_DATA = {
  user: { id: "u1", name: "Abhishek", email: "abhishek@example.com" },
  settings: { theme: "dreamy", currency: "INR", monthlyBudget: 25000 },
  income: [
    { id: "inc1", source: "Pocket Money", amount: 20000, date: "2025-09-01" },
    { id: "inc2", source: "Freelance App", amount: 8000, date: "2025-09-15" }
  ],
  expenses: [
    { id: "e1", date: "2025-10-02", amount: 240, category: "Food", mode: "UPI", note: "Lunch Zomato" },
    { id: "e2", date: "2025-10-04", amount: 1200, category: "Transport", mode: "Card", note: "Monthly pass" },
    { id: "e3", date: "2025-10-07", amount: 599, category: "Subscriptions", mode: "Card", note: "Netflix" },
    { id: "e4", date: "2025-10-10", amount: 3500, category: "Shopping", mode: "Card", note: "Shoes" }
  ],
  goals: [
    { id: "g1", name: "Trip to Goa", target: 10000, saved: 7500 },
    { id: "g2", name: "New Laptop", target: 60000, saved: 15000 }
  ],
  bills: [
    { id: "b1", name: "Electricity", amount: 1800, dueDate: "2025-10-20", recurring: "monthly" },
    { id: "b2", name: "WiFi", amount: 699, dueDate: "2025-10-18", recurring: "monthly" }
  ],
  subscriptions: [
    { id: "s1", name: "Spotify", amount: 99, nextDue: "2025-11-05", cycle: "monthly" },
    { id: "s2", name: "Netflix", amount: 599, nextDue: "2025-11-25", cycle: "monthly" }
  ],
  debts: [
    { id: "d1", name: "Rohit", amount: 1200, type: "owed_to_me", due: "2025-11-01", note: "Dinner" },
    { id: "d2", name: "Sara", amount: 500, type: "i_owe", due: "2025-10-30", note: "Movie" }
  ],
  challenges: [
    { id: "c1", name: "Under ₹5000 Oct", limit: 5000, month: "2025-10", progress: 3800 }
  ],
  badges: ["first-saver"]
};
