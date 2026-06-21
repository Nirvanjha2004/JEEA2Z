# 🚀 JEE Sheet — The Ultimate Structured Problem Tracker for JEE Aspirants

[![Framework](https://img.shields.io/badge/Frontend-React%20%26%20Vite-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org)
[![Styles](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Status](https://img.shields.io/badge/Version-V3.8%20Beta-orange?style=for-the-badge)](https://jeea-2-z.vercel.app)

**JEE Sheet** is a high-yield, topic-wise, and concept-wise problem tracking platform designed exclusively for Joint Entrance Examination (JEE Main & Advanced) aspirants. Inspired by the highly successful *Striver A2Z sheet* in software engineering, JEE Sheet transforms unorganized preparation into a disciplined, structured path to success.

---

## 📸 Product Preview

### Sleek, Interactive Dashboard
![JEE Sheet Dashboard](public/LandingPage.png)

### Concept Masteries & AI-Powered Question Solver
![Question Solving Interface](public/QuestionPage.png)

---

## 🎯 What is JEE Sheet?
JEE Sheet is a structured problem tracker mapped to the complete JEE syllabus. Instead of randomly solving questions from multiple books, JEE Sheet provides a curated path of **high-yield questions** categorised by subject, chapter, and micro-concept. 

Every question on the platform is handpicked and tagged with its difficulty (Easy, Medium, Hard) and type (PYQ, Concept Builder, Practice). You can track your progress dynamically, write down personal notes, bookmark questions, and see your mastery improve.

---

## 💡 Why was it made?
JEE preparation can feel overwhelming. Aspirants face two major challenges:
1. **Information Overload**: Thousands of questions across hundreds of reference books, making it easy to get lost.
2. **Lack of Structure**: No clear way to identify weak concepts or remember which questions to revise before the exam.

**JEE Sheet** was built to solve this. It acts as a single source of truth for problem solving. By grouping questions into micro-concepts and patterns, it ensures that you master the *entire* syllabus systematically, rather than just solving random questions.

---

## 🏆 How does it help you?

- **Pinpoints Weaknesses**: The dashboard dynamically diagnoses your weak patterns and recommends 5 targeted questions every day in **Today's Practice**.
- **Ensures Perfect Revision (Spaced Repetition)**: Automatically queues questions you struggled with (marked as *Revisit*) for review, ensuring you don't forget important concepts.
- **AI-Powered Learning (Groq-Powered hints)**: Stays by your side like a personal tutor, giving you progressive, step-by-step hints instead of spoiling the final solution immediately.
- **Builds Exam Consistency**: Tracks your daily solves with a visual **Streak Calendar** to keep you motivated and consistent.

---

## ✨ Premium Features

### 🔹 Topic & Micro-Concept Breakdown
Every chapter (e.g. *Kinematics*, *Differentiation*, *Coordination Compounds*) is broken down into specific concept groups, displaying your progress and mastery percentage for each.

### 🔹 Comprehensive Dashboard Analytics
Includes visual Recharts statistics, showing your subject-wise done/revisit ratios, average accuracy, and recent solves.

### 🔹 Spaced Repetition Revision Queue
A dedicated queue that schedules questions for revision based on how well you solved them, saving you from last-minute revision panic.

### 🔹 AI Progressive Hints
Instead of looking at the solution directly, get up to 3 progressive hints using cutting-edge AI to guide you to the answer.

### 🔹 Full-Length Mock Tests
Timed mock tests that simulate the real JEE Main/Advanced exam patterns, complete with marking schemes (+4 / -1) and performance analysis.

### 🔹 Bookmarks & personal Notes
Save tricky questions and write down key formulas or tricks directly on the question page for quick reviews.

---

## 🔒 Lock in Early-Bird Access (Transitioning to Premium Soon!)

> [!IMPORTANT]
> **JEE Sheet is currently in Open Beta and 100% Free!**
> To support high-performance database hosting, premium curated question banks, and AI-powered tutor APIs, we will soon transition to a **paid subscription model**.
>
> **Register your account today** to lock in early-bird advantages, participate in beta feedback, and receive discount slots on the premium launch!

---

## 🛠️ Technology Stack

- **Frontend**: React 19 (Vite), Tailwind CSS v4, Zustand (State Management), React Router v7, Axios, Recharts, KaTeX (LaTeX math equations rendering)
- **Backend**: Node.js, Express, PostgreSQL (`pg` pool driver), Zod validation, JWT authentication, Bcrypt encryption, Groq SDK (Llama 3.3 model API)

---

## 💻 Local Setup Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org) (v18+)
- [PostgreSQL](https://www.postgresql.org) database running locally on port `5432` (or via Docker).

### 2. Database Initialization (Docker Recommended)
Ensure Docker is running and execute:
```bash
docker compose up -d
```
*This launches a PostgreSQL container running on port `5432` with database `jeesheet` and user/password `postgres/postgres`.*

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/jeesheet
   JWT_SECRET=your-secure-jwt-key
   PORT=5000
   GROQ_API_KEY=your-groq-api-key
   GROQ_MODEL=llama-3.3-70b-versatile
   ```
4. Seed the database with high-quality questions:
   ```bash
   npm run seed
   ```
5. Start the API server:
   ```bash
   npm run dev
   ```

### 4. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the Vite client:
   ```bash
   npm run dev
   ```

---

## 👥 Contributors & Feedback
For feature requests or feedback, feel free to open a GitHub issue or contact early-access support inside the platform. Enjoy your preparation journey to IIT! 🎓
