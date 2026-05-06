# ONLINE INTERNSHIP & JOB PORTAL

An internship and job marketplace built with a React frontend, a Node.js/Express backend, MongoDB, and Socket.IO for real-time updates. The platform supports students, clients/employers, and admins with role-based dashboards, job postings, applications, notifications, messaging, wallets, ratings, and profile management.

## Features

- Student registration, login, dashboard, profile management, resume upload, and job applications
- Client/employer job posting, editing, deletion, and applicant tracking
- Admin capabilities through a separate admin frontend
- Real-time notifications and messaging with Socket.IO
- Wallet and rating systems for tracked engagement and payments
- Public profile pages for client accounts
- Policy and support pages for a production-style user experience

## Tech Stack

- Frontend: React 19, React Router, Bootstrap, Axios
- Admin Frontend: React 19, React Router, Bootstrap, Axios
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs, multer, nodemailer, Socket.IO
- Database: MongoDB
- Deployment target: Render

## Project Structure

```text
root
|-- backend/           Express API, MongoDB models, auth, jobs, applications, messages, notifications, wallet, ratings
|-- frontend/          Main public app for students and clients
|-- admin-frontend/    Separate admin UI
|-- render.yaml        Render deployment config for the backend
|-- verify-setup.js    Environment/setup validation helper
```

## Main User Flows

- Students can register, browse jobs, apply, receive notifications, and manage profiles and wallets.
- Clients can post jobs, manage postings, review applicants, and view analytics for their listings.
- Admin users can manage platform activity from the admin frontend.

## Local Setup

### Prerequisites

- Node.js 18 or newer
- MongoDB connection string
- Email credentials if you want outgoing email features to work

### 1. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with:

```env
MONGO_URI=your_mongodb_connection_string
MONGO_DB_NAME=online_internship_portal
JWT_SECRET=your_secure_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_password
FRONTEND_URL=http://localhost:3000
ADMIN_FRONTEND_URL=http://localhost:3001
PORT=5000
```

Start the backend:

```bash
npm run dev
```

### 2. Main frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/` if needed:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm start
```

### 3. Admin frontend setup

```bash
cd admin-frontend
npm install
```

If the admin UI needs API configuration, point it to the same backend endpoints used by the main app.

Start the admin frontend:

```bash
npm start
```

## Available Scripts

### Backend

- `npm run dev` - start the API with nodemon
- `npm start` - start the API normally
- `npm run init:db` - initialize the database
- `npm run create:admin` - create an admin user

### Frontend and admin frontend

- `npm start` - start the React app
- `npm run build` - create a production build
- `npm test` - run tests

## Backend API Overview

The backend exposes routes under `/api` for:

- `/api/auth` - registration, login, profile, public profile, and profile picture upload
- `/api/jobs` - job listing, creation, editing, deletion, and job summaries
- `/api/applications` - job applications and application workflow
- `/api/admin` - administrative controls
- `/api/messages` - user messaging
- `/api/ratings` - ratings and engagement tracking
- `/api/notifications` - notifications and alerts
- `/api/wallet` - wallet and transaction features

## Deployment Notes

This repository includes a Render configuration in `render.yaml` for the backend service. The deployment expects the same environment variables used locally, especially `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASSWORD`, `FRONTEND_URL`, and `ADMIN_FRONTEND_URL`.

## Troubleshooting

- If the backend fails to start, confirm that `MONGO_URI` and `JWT_SECRET` are set.
- If login or registration fails, verify the backend is running on the expected port and the frontend API URL points to `/api`.
- If sockets do not connect, confirm the frontend socket URL matches the backend host and port.

## Notes

- The repository is structured as a full-stack project, so changes in the backend and frontend should usually be tested together.
- The main user app and admin app are separate React projects in this repository.
