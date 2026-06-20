# JEE Sheet — Structured JEE Problem Tracker

JEE Sheet is a topic-wise problem tracker designed for JEE (Joint Entrance Examination) aspirants. It functions like the Striver A2Z sheet for software development, helping students track their preparation across Physics, Chemistry, and Mathematics.

## Features

- **Topic-wise breakdown** of chapters for Physics, Chemistry, and Mathematics.
- **Realistic JEE Questions** (Easy, Medium, Hard) categorized into PYQs, Concept Builders, and Practice Problems.
- **Progress Tracking** with status toggles (To Do, Done, Revisit).
- **Interactive Dashboard** with Recharts donut progress distribution and breakdown statistics.
- **Clean Dark Navy UI** built using Tailwind CSS v4.

---

## Technology Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Zustand (state), React Router v6, Axios, Recharts
- **Backend**: Node.js, Express, PostgreSQL (`pg` driver), Zod validation, JWT authentication, bcrypt password hashing

---

## Local Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database instance

### 1. Database Creation (via Docker or Local installation)

#### Option A: Using Docker (Recommended)
We have provided a `docker-compose.yml` file at the root. To launch PostgreSQL in Docker:
1. Ensure your Docker Desktop is running.
2. From the root of the project, run:
   ```bash
   docker compose up -d
   ```
This automatically sets up a PostgreSQL container named `jeesheet-postgres` running on port `5432` with username `postgres`, password `postgres`, and creates a database named `jeesheet`.

#### Option B: Using a Local PostgreSQL Installation
Ensure PostgreSQL is running locally on port `5432`. Connect to your server (e.g., using `psql` or pgAdmin) and run:
```sql
CREATE DATABASE jeesheet;
```

### 2. Backend Configuration

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/jeesheet
   JWT_SECRET=jee-sheet-super-secret-key-change-in-production
   PORT=5000
   ```
   *(Update username/password in `DATABASE_URL` if they are different from `postgres/postgres`)*.

4. Run the seed script to create tables and insert mock questions:
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

### 3. Frontend Configuration

1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:5173` (or the port specified by Vite).

---

## Running Both Servers Simultaneously

To run both backend and frontend simultaneously from the root of the workspace, you can install `concurrently` at the root directory:

1. Create a `package.json` at the root (`/`) of your workspace:
   ```json
   {
     "name": "jee-sheet",
     "version": "1.0.0",
     "scripts": {
       "install-all": "npm install --prefix backend && npm install --prefix frontend",
       "dev": "npx concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
     },
     "devDependencies": {
       "concurrently": "^8.2.2"
     }
   }
   ```
2. Install `concurrently`:
   ```bash
   npm install
   ```
3. Run the development environment:
   ```bash
   npm run dev
   ```

Enjoy tracking your JEE preparation journey!
