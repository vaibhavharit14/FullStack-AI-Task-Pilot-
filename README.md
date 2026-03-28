Vercel Deployment :- https://full-stack-ai-task-pilot.vercel.app/login
# 🚀 AI Powered Task Management System

A premium full-stack application built for the **Full Stack Development Internship Assignment**. This application features a modern React (Vite) frontend, a robust Node.js/Express backend with MongoDB, and intelligent AI task coaching integration using Google's Gemini Pro.

## ✨ Key Features
- **Modern Auth**: Secure registration and login using JWT and Bcrypt.
- **Dynamic CRUD**: Full task management with real-time status updates and priority categorization.
- **AI Integration**: One-click AI productivity coaching that provides immediate tips/breakdowns for your tasks.
- **Premium UI**: Dark-mode glassmorphism design with fluid animations and responsive layout.
- **Database**: Persistent storage with MongoDB.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Lucide-React, Axios, React Router.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose ODM).
- **AI Service**: Google Generative AI (Gemini 1.5 Flash).
- **Auth**: JSON Web Tokens (JWT).

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### 2. Backend Setup
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the template:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai-task-manager
   JWT_SECRET=your_super_secret_jwt_key
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

---

## 🏗️ Architecture Decisions
- **Separation of Concerns**: Decoupled Client and Server for scalability and cleaner developer experience.
- **Context API for Auth**: Centralized auth state to avoid "prop-drilling" and ensure secure route protection.
- **Express Middleware**: Standardized JWT verification to secure task CRUD operations.
- **AI Utility Layer**: Integrated the AI logic at the controller level to allow seamless enhancement of user-submitted data.
- **Modern Styling**: Used vanilla CSS with CSS Variables for a fully custom, high-performance "Glassmorphism" design.

---

## 👤 Author
**Vaibhav** - Full Stack Intern Submission
