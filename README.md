# 🚀 Customer Follow-up Tracker

A full-stack web application designed for small businesses to track, schedule, and maintain consistent customer follow-ups without duplicate reminders or missed interactions.

---

## 📌 Features & Architecture

- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons + Axios
- **Backend**: Node.js + Express.js + RESTful API
- **Database**: MongoDB with Mongoose ODM
- **Scheduling Model**: Dynamic calculation engine (avoids stale flags and duplicate follow-up records)

---

## 🧠 Follow-up Logic & Core Calculations

### 1. The Follow-up Formula
Instead of storing a static `isDue` boolean that gets out of sync as days pass, the application dynamically calculates the target follow-up date and status:

$$\text{nextFollowUpDate} = \text{lastContactedAt} + (\text{followUpInterval} \times 24 \times 60 \times 60 \times 1000)$$

### 2. Status Categorization
Comparing $\text{nextFollowUpDate}$ against normalized local day boundaries ($\text{startOfDay}$ and $\text{endOfDay}$):
- **Overdue**: $\text{nextFollowUpDate} < \text{startOfDay}$
- **Due Today**: $\text{startOfDay} \le \text{nextFollowUpDate} \le \text{endOfDay}$
- **Upcoming**: $\text{nextFollowUpDate} > \text{endOfDay}$

---

## 💡 Key Architectural & Design Decisions

### Q1: What happens if a customer is contacted earlier than their scheduled date?
> **Example**:
> - Customer: Rahul
> - Interval: 7 days
> - Last Contacted: August 25 $\rightarrow$ Scheduled Next Follow-up: **September 1**
> - Suppose Rahul calls in or is contacted early on **August 29**.
> 
> **Handling**: When `POST /api/customers/:id/contact` is called on August 29, `lastContactedAt` updates to **August 29**.
> The calculated next follow-up automatically becomes:
> $$\text{August 29} + 7\text{ days} = \text{September 5}$$
> Rahul immediately vacates the "Due Today" list for September 1 and is moved to "Upcoming" for September 5.

---

### Q2: What happens if invalid dates or data are entered?
> **Two-Tier Validation Strategy**:
> 1. **Frontend Validation**: Instant interactive visual feedback on the form:
>    - **Name**: Required, trimmed, minimum 2 characters.
>    - **Contact**: At least one valid Phone number or Email address is strictly required.
>    - **Interval**: Must be a positive integer $\ge 1$ day (rejects $0$, negative numbers, decimals, or non-numeric strings).
>    - **Last Contacted Date**: Cannot be a future date (rejects future timestamps).
> 2. **Backend Validation**: An Express validation middleware and Mongoose schema pre-validation enforce data integrity before any write is executed in MongoDB.

---

### Q3: How do you make sure the same customer isn't shown as requiring multiple follow-ups?
> **Handling**:
> We do **not** generate new reminder documents or duplicate task queue records on every dashboard check. 
> The customer's due status is a purely functional derivation of $\text{lastContactedAt} + \text{followUpInterval}$.
> Once marked contacted:
> - `lastContactedAt` updates to the current timestamp.
> - The single customer record automatically rolls forward to the next cycle.
> - This guarantees that each customer appears **exactly once** in the appropriate priority section.

---

### Q4: How is the application structured for future extensibility?
> - **Modular MVC Layering**: Routes $\rightarrow$ Middlewares $\rightarrow$ Controllers $\rightarrow$ Models $\rightarrow$ Database.
> - **Contact History Timeline**: The schema includes a `contactHistory` array recording historical outreach timestamps and notes.
> - **Notifications & Webhooks**: Can easily plug in Cron/Node-schedule background workers or WhatsApp/Twilio/SendGrid APIs to send automatic outreach reminders.
> - **CRM Tagging & Pipeline Stages**: The model easily extends to support sales stages (`Lead`, `Negotiation`, `Closed Won`), assignee team members, and custom tags.

---

## 📡 API Reference

### 1. Get All Customers
```http
GET /api/customers?search=rahul&status=due_today&sortBy=nextFollowUpDate
```

### 2. Get Due & Overdue Customers
```http
GET /api/customers/due
```

### 3. Get Summary Metrics
```http
GET /api/customers/metrics
```

### 4. Create a Customer
```http
POST /api/customers
Content-Type: application/json

{
  "name": "Rahul Sharma",
  "phone": "+91 9876543210",
  "email": "rahul.sharma@example.com",
  "company": "Apex Logistics",
  "followUpInterval": 7,
  "lastContactedAt": "2026-08-25T10:00:00.000Z",
  "notes": "Discussed contract renewal"
}
```

### 5. Mark Customer as Contacted
```http
POST /api/customers/:id/contact
Content-Type: application/json

{
  "note": "Quarterly review call completed"
}
```

### 6. Update Customer
```http
PUT /api/customers/:id
```

### 7. Delete Customer
```http
DELETE /api/customers/:id
```

---

## 🛠️ Local Development & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas URI in `.env`)

---

### 1. Server Setup

```bash
cd server
npm install
# Create .env (already configured with PORT=5001 and MONGODB_URI)
npm run seed     # (Optional) Populates sample customers (Due Today, Overdue, Upcoming)
npm run dev      # Starts Express server on http://localhost:5001
```

---

### 2. Client Setup

```bash
cd client
npm install
npm run dev      # Starts Vite React dev server on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser to interact with the application!
