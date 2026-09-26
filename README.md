# Prep-AI

Prep-AI is a full-stack web app that generates a personalized interview preparation report from your resume, a short self-description, and a target job description. It uses Google's Gemini model to produce a job-match score, likely technical and behavioral questions (with the intent behind each and how to answer it), identified skill gaps, and a day-by-day preparation plan — and lets you export the report as a PDF.

## Features

- 🔐 User authentication (register, login, logout) with JWT stored in cookies
- 📄 Resume upload (PDF) parsed and combined with your self-description and a job description
- 🤖 AI-generated interview report via Google Gemini, including:
  - Match score against the job description
  - Technical questions with intention + suggested answers
  - Behavioral questions with intention + suggested answers
  - Skill gaps with severity ratings
  - A structured, day-by-day preparation plan
- 🧾 Export a generated report to PDF (via Puppeteer)
- 📚 View past reports (get all / get by ID)

## Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Google Gemini API (`@google/genai`)
- JWT auth (`jsonwebtoken`, `bcryptjs`, `cookie-parser`)
- `multer` for resume file uploads, `pdf-parse` for reading resume PDFs
- `puppeteer` for PDF report generation
- `zod` / `zod-to-json-schema` for structured AI output validation

**Frontend**
- React 19 + React Router
- Vite
- Axios

## Project Structure

```
prep-ai/
├── Backend/
│   ├── server.js               # entry point
│   ├── src/
│   │   ├── app.js              # express app setup
│   │   ├── config/db.js        # MongoDB connection
│   │   ├── controllers/        # auth & interview logic
│   │   ├── middlewares/        # auth + file upload middleware
│   │   ├── models/             # Mongoose schemas (User, InterviewReport, Blacklist)
│   │   ├── routes/             # /api/auth, /api/interview
│   │   └── services/ai.service.js  # Gemini prompt + PDF generation
│   └── public/                 # serves built frontend in production
└── Frontend/
    └── src/
        ├── features/
        │   ├── auth/           # login/register pages, context, hooks
        │   ├── interview/      # report generation pages, context, hooks
        │   └── app/             # shared app routes/pages/styles
        ├── App.jsx
        └── main.jsx
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB instance (local or Atlas)
- A Google Gemini API key

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/prep-ai.git
cd prep-ai
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/` with:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

Run the backend:

```bash
npm run dev     # with nodemon
# or
npm start
```

### 3. Frontend setup

```bash
cd Frontend
npm install
npm run dev
```

The frontend runs on Vite's default dev server (usually `http://localhost:5173`) and talks to the backend at the URL configured in your frontend API client / env.

## API Overview

| Method | Endpoint                                | Description                                   | Auth |
|--------|------------------------------------------|------------------------------------------------|------|
| POST   | `/api/auth/register`                    | Register a new user                            | Public |
| POST   | `/api/auth/login`                       | Log in                                         | Public |
| GET    | `/api/auth/logout`                      | Log out                                        | Private |
| GET    | `/api/auth/get-me`                      | Get current logged-in user                     | Private |
| POST   | `/api/interview`                        | Generate a new interview report (resume + JD + self-description) | Private |
| GET    | `/api/interview`                        | Get all interview reports for the logged-in user | Private |
| GET    | `/api/interview/report/:interviewId`    | Get a specific interview report                | Private |
| POST   | `/api/interview/resume/pdf/:interviewReportId` | Generate a downloadable PDF of a report | Private |

## Roadmap

- [ ] Store metadata about the AI model used to generate each report

## License

ISC
