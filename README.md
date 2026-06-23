# AI Proctor — Smart Online Exam Proctoring System

## Project Structure
```
ai-proctor/
├── frontend/         # React.js + Tailwind CSS
└── backend/          # Node.js + Express + MongoDB
```

---

## Frontend Setup
```bash
cd frontend
npm install
npm start            # runs on http://localhost:3000
```

## Backend Setup
```bash
cd backend
npm install
# Edit .env — set your MONGO_URI and JWT_SECRET
npm run dev          # runs on http://localhost:5000
```

---

## API Endpoints

| Method | Endpoint                        | Description              | Auth     |
|--------|---------------------------------|--------------------------|----------|
| POST   | /api/auth/register              | Register user            | Public   |
| POST   | /api/auth/login                 | Login                    | Public   |
| GET    | /api/auth/me                    | Get current user         | Student+ |
| GET    | /api/exams                      | List all exams           | Student+ |
| GET    | /api/exams/:id                  | Get exam by ID           | Student+ |
| POST   | /api/exams                      | Create exam              | Proctor+ |
| DELETE | /api/exams/:id                  | Deactivate exam          | Admin    |
| POST   | /api/sessions/start             | Start exam session       | Student  |
| POST   | /api/sessions/:id/alert         | Log proctoring alert     | Student  |
| POST   | /api/sessions/:id/submit        | Submit exam              | Student  |
| GET    | /api/sessions/:id               | Get session details      | Student+ |
| GET    | /api/reports                    | All reports              | Proctor+ |
| GET    | /api/reports/:sessionId         | Detailed exam report     | Student+ |

---

## Tech Stack
- **Frontend**: React 18, Tailwind CSS 3
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
