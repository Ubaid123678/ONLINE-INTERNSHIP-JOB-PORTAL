# Deployment Guide

## Backend (Render example)
1. Push the `backend/` folder to GitHub.
2. Create a new Web Service on [Render](https://render.com/) pointing to the repo.
3. Build command: `cd backend && npm install`
4. Start command: `cd backend && npm run start`
5. Configure environment variables:
   - `PORT` (Render provides this automatically, but keep `5000` locally)
   - `MONGO_URI`
   - `MONGO_DB_NAME`
   - `JWT_SECRET`
   - `ADMIN_REGISTRATION_SECRET` (optional)
   - `EMAIL_USER`
   - `EMAIL_PASS`
6. Add a persistent disk or use services such as S3 for uploads if you need to store resumes outside Render. Update `middleware/upload.js` destination accordingly.
7. Enable automatic deploys. On success, note the public API URL (e.g., `https://portal-api.onrender.com`).

## Frontend (Vercel example)
1. Push the `frontend/` folder to GitHub (same repo is fine).
2. Import the repo on [Vercel](https://vercel.com/).
3. Framework preset: `Create React App`.
4. Build command: `cd frontend && npm install && npm run build`
5. Output directory: `frontend/build`.
6. Environment variables:
   - `REACT_APP_API_URL=https://portal-api.onrender.com/api`
7. After deploy, the UI will call the hosted backend via the environment variable.

## Testing before deploy
- Run `cd backend && npm run dev` to start the API locally.
- In another terminal, `cd frontend && npm install && npm run dev` to start the React client.
- Create test accounts (student, recruiter, admin) and verify:
  - Recruiters can post, list, and delete jobs.
  - Students can apply and receive confirmation emails.
  - Admin dashboard loads metrics/tables and delete actions.

## Post-deploy checklist
- Seed at least one admin user directly in MongoDB.
- Configure `EMAIL_USER` with an app-specific password (Gmail or another SMTP provider).
- Set up HTTPS on both frontend and backend (Render and Vercel handle this automatically).
- Update DNS to point to the Vercel domain if you have a custom domain.
