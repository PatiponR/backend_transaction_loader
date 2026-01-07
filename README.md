# Backend Transaction Loader

A Node.js/Express backend service for managing machine transaction data and real-time status monitoring.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or Local)
- Docker (Optional)

### Installation

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env` file in the root directory:
    ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    NODE_ENV=development
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

---

## 📡 API Documentation

Base URL: `http://localhost:5001/api`

### 🏭 Machines

#### Get All Machine Profiles
- **GET** `/machines`
- **Response**: List of all registered machines.

#### Create Machine Profile
- **POST** `/machines`
- **Body**:
  ```json
  {
    "machineId": "M001",
    "name": "CNC Lathe",
    "modbusPort": "502"
  }
  ```

#### Get Machine Status (Activity)
Calculates active/inactive status based on the latest transaction.
- **GET** `/machines/status` (All machines)
- **GET** `/machines/:id/status` (Specific machine)
- **Query Params**:
  - `startDate`: YYYY-MM-DD (Defaults to today 00:00)
  - `endDate`: YYYY-MM-DD (Defaults to today 23:59)

#### Get Machine Inactive Time
Calculates total active downtime in minutes.
- **GET** `/machines/inactive-time` (All machines)
- **GET** `/machines/:id/inactive-time` (Specific machine)
- **Query Params**:
  - `startDate`: YYYY-MM-DD
  - `endDate`: YYYY-MM-DD

---

### 💸 Transactions

#### Get Transactions
- **GET** `/transactions`

#### Get Transactions by Date
- **GET** `/transactions/:date`
- **Example**: `/transactions/2026-01-07`

#### Create Transaction
- **POST** `/transactions`
- **Body**:
  ```json
  {
    "machineId": "M001",
    "transactionAmount": 1, 
    "transactionTime": "14:30" 
  }
  ```
  - `transactionAmount`: `1` (Active) or `0` (Inactive).
  - Triggers a real-time WebSocket event.

---

### 🔌 Real-time Updates (Socket.io)

Connect to the server URL (e.g., `http://localhost:5001`) to receive real-time updates.

**Event:** `newTransaction`

**Payload:**
```json
{
  "machineId": "M001",
  "transactionAmount": 1,
  "transactionTime": "14:30",
  "transactionId": "uuid-timestamp",
  "transactionDate": "2026-01-07T..."
}
```

---

## 🛠 Deployment

See [deployment_guide.md](./deployment_guide.md) for Docker and cloud deployment instructions.
