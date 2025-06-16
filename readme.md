# Loan-as-a-Service (LaaS) API

> A modular, secure, and extensible loan management system built with Node.js, TypeScript, Express, MongoDB.

## 🚀 Features

- 🔐 **Authentication**: Login, Signup, Access & Refresh Token, Session management  
- 🧑‍💼 **User Roles**: Admin, Customer, Lender, Agent with RBAC  
- 💸 **Loan Management**: Apply, Approve, Reject, Track  
- 💰 **Repayment Tracking**: Repay loans, auto update balances  
- 📊 **Commission Tracking**: Agent commission history per loan  
- 🔔 **Notifications**: Events for repayment, approval, and due alerts  
- ⚙️ **Modular Architecture**: DTOs, Middleware, Services, Repositories  

---

## 🏗️ Tech Stack

- **Backend**: Node.js, Express  
- **Language**: TypeScript  
- **Database**: MongoDB (Mongoose)  
- **Auth**: JWT, Refresh Tokens, Session Store  
- **Validation**: Joi  
- **Scheduling**: `node-cron`  
- **Dev Tools**: Nodemon, ESLint, Prettier  

---

## 🔐 Authentication Flow

- **Login** → returns access & refresh token  
- **Refresh Token** → POST `/auth/refresh-token` (requires cookie)  
- **Session Store** → MongoDB-based for refresh token tracking  
- **Logout** → Clear session and cookies  

---

## 👤 Roles & Permissions

| Role     | Capabilities                      |
|----------|-----------------------------------|
| Customer | Apply Loan, Repay, View History   |
| Admin    | Approve/Reject Loans, List Loans  |
| Lender   | View Loans + Filters              |
| Lender   | View Commission History           |

Agent and Lender are used to represent a particular role
---

## 📘 API Endpoints (v1)

### 🔑 Auth
```http
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/logout
```

### 💰 Loan
```http
POST   /api/v1/loans/apply              # customer
PATCH  /api/v1/loans/:loanId/approve    # admin
PATCH  /api/v1/loans/:loanId/reject     # admin
GET    /api/v1/loans                    # lender
```

### 💸 Repayment
```http
POST   /api/v1/repayment/:loanId            # customer
```

### 🧾 Agent
```http
GET    /api/v1/agents/commissions           # lender
```

---

## 🧪 Running Locally

```bash
git clone https://github.com/your-org/LaaS.git
cd LaaS
npm install

# Create .env from template
touch .env
# Fill in Mongo URI, JWT secrets, etc.

npm run dev
```
---

## 🤝 Contributing

Pull requests are welcome!:

```bash
git pull
```

---

## 📄 License

MIT © 2025 Loan-as-a-Service Team
