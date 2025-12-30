# Deployment Guide: Online Internship & Job Portal

This guide will walk you through deploying your Online Internship & Job Portal to GitHub, Vercel, Render, and MongoDB Atlas.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [GitHub Repository Setup](#github-repository-setup)
4. [Backend Deployment (Render)](#backend-deployment-render)
5. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
6. [Admin Frontend Deployment (Vercel)](#admin-frontend-deployment-vercel)
7. [Post-Deployment Steps](#post-deployment-steps)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- A GitHub account
- A Vercel account (sign up at https://vercel.com)
- A Render account (sign up at https://render.com)
- A MongoDB Atlas account (sign up at https://www.mongodb.com/cloud/atlas)
- Git installed on your local machine

---

## MongoDB Atlas Setup

### Step 1: Create a New Cluster

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Build a Database"** (or **"Create"** if you have existing clusters)
3. Choose the **FREE** tier (M0 Sandbox)
4. Select a cloud provider and region closest to your Render deployment region
5. Click **"Create Cluster"** (this may take a few minutes)

### Step 2: Configure Database Access

1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create a username and strong password (save these credentials securely!)
5. Set user privileges to **"Read and write to any database"**
6. Click **"Add User"**

### Step 3: Configure Network Access

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is necessary for Render and Vercel to access your database
   - ⚠️ Note: This is safe when combined with strong authentication
4. Click **"Confirm"**

### Step 4: Get Your Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** as the driver and the latest version
5. Copy the connection string (it looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your actual credentials
7. **Important**: Remove any `<>` symbols and ensure the password is URL-encoded if it contains special characters

**Example Connection String:**
```
mongodb+srv://myuser:MyP@ssw0rd@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

---

## GitHub Repository Setup

### Step 1: Initialize Git Repository (if not already done)

Open your terminal in the project root directory:

```bash
cd "d:\ONLINE INTERNSHIP & JOB PORTAL"
git init
git add .
git commit -m "Initial commit: Online Internship & Job Portal"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon in the top right → **"New repository"**
3. Name your repository (e.g., `online-internship-portal`)
4. Choose **"Private"** or **"Public"** based on your preference
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

### Step 3: Push to GitHub

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repository name:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 4: Verify Upload

1. Refresh your GitHub repository page
2. Ensure all files are uploaded
3. Check that sensitive files like `.env` are **NOT** visible (they should be ignored by `.gitignore`)

---

## Backend Deployment (Render)

### Step 1: Create Web Service

1. Log in to [Render](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Choose **"Build and deploy from a Git repository"**
4. Click **"Connect account"** and authorize Render to access your GitHub
5. Select your repository from the list
6. Click **"Connect"**

### Step 2: Configure Web Service

Fill in the following details:

- **Name**: `online-internship-backend` (or your preferred name)
- **Region**: Choose the region closest to you (e.g., Oregon, Frankfurt)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: **Free**

### Step 3: Set Environment Variables

Scroll down to **"Environment Variables"** and add the following:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `MONGO_URI` | `your-mongodb-atlas-connection-string` | From MongoDB Atlas setup |
| `MONGO_DB_NAME` | `online_internship_portal` | |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this` | Use a strong random string |
| `EMAIL_USER` | `your-email@gmail.com` | Your Gmail address |
| `EMAIL_PASSWORD` | `your-app-specific-password` | Gmail App Password (see note below) |
| `PORT` | `5000` | |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Will update after Vercel deployment |
| `ADMIN_FRONTEND_URL` | `https://your-admin.vercel.app` | Will update after Vercel deployment |

**Gmail App Password Setup:**
1. Go to [Google Account Settings](https://myaccount.google.com)
2. Navigate to Security → 2-Step Verification
3. Scroll to **"App passwords"**
4. Generate an app password for "Mail"
5. Use this 16-character password in `EMAIL_PASSWORD`

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for the deployment to complete (this may take 5-10 minutes)
3. Once deployed, you'll see a URL like: `https://online-internship-backend.onrender.com`
4. **Copy this URL** - you'll need it for frontend deployment

### Step 5: Test Backend

Visit: `https://your-backend-url.onrender.com/api/auth/test`

If you see a response (even an error like "Route not found" is OK), your backend is running!

**Important:** The free tier on Render will spin down after 15 minutes of inactivity. The first request after spin-down will take 30-60 seconds to wake up.

---

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Vercel will detect it's a monorepo with multiple projects

### Step 2: Configure Frontend Project

- **Framework Preset**: Create React App
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### Step 3: Set Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://your-backend-url.onrender.com/api` |
| `REACT_APP_SOCKET_URL` | `https://your-backend-url.onrender.com` |

Replace `your-backend-url` with your actual Render backend URL.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (2-5 minutes)
3. You'll get a URL like: `https://your-app.vercel.app`
4. Click **"Visit"** to see your deployed frontend

### Step 5: Update Backend Environment Variables

Now that you have the frontend URL, go back to Render:

1. Go to your backend service on Render
2. Navigate to **"Environment"** tab
3. Update `FRONTEND_URL` with your Vercel URL: `https://your-app.vercel.app`
4. Click **"Save Changes"**
5. The backend will automatically redeploy

---

## Admin Frontend Deployment (Vercel)

### Step 1: Create New Project in Vercel

1. In Vercel dashboard, click **"Add New"** → **"Project"**
2. Import the **same** GitHub repository again
3. This time, configure it for the admin frontend

### Step 2: Configure Admin Frontend Project

- **Framework Preset**: Create React App
- **Root Directory**: `admin-frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### Step 3: Set Environment Variables

Add the following environment variable:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://your-backend-url.onrender.com/api` |

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete
3. You'll get a URL like: `https://your-admin.vercel.app`

### Step 5: Update Backend Environment Variables (Again)

Go back to Render one more time:

1. Navigate to **"Environment"** tab of your backend service
2. Update `ADMIN_FRONTEND_URL` with: `https://your-admin.vercel.app`
3. Click **"Save Changes"**

---

## Post-Deployment Steps

### Step 1: Initialize Database

You need to create an admin user. On Render:

1. Go to your backend service
2. Click **"Shell"** in the top right
3. Run the following command:
   ```bash
   npm run create:admin
   ```
4. Follow the prompts to create your admin account

Alternatively, you can run it locally with your production MongoDB URI:

```bash
cd backend
node scripts/createAdmin.js
```

### Step 2: Test Your Application

1. **Frontend**: Visit your Vercel frontend URL
2. **Sign Up**: Create a test student/recruiter account
3. **Login**: Verify login works
4. **Post a Job**: If recruiter, try posting a job
5. **Apply**: If student, try applying to a job
6. **Admin**: Visit admin frontend and login with admin credentials

### Step 3: Custom Domain (Optional)

#### For Vercel:
1. Go to your project settings
2. Navigate to **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

#### For Render:
1. Go to your backend service settings
2. Navigate to **"Custom Domains"**
3. Add your custom domain
4. Update DNS records as instructed

### Step 4: Set Up Continuous Deployment

Already done! 🎉

Both Vercel and Render will automatically deploy when you push to the `main` branch on GitHub.

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

---

## Troubleshooting

### Backend Issues

#### Error: "Cannot connect to MongoDB"
- Verify your `MONGO_URI` is correct
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check username/password are correctly encoded
- Verify database user has proper permissions

#### Error: "Port already in use"
- Render automatically sets the PORT. Don't hardcode it.
- Ensure `process.env.PORT` is used in server.js

#### Backend is slow to respond
- This is normal on Render's free tier after inactivity
- First request takes 30-60 seconds (cold start)
- Consider upgrading to paid tier for production

### Frontend Issues

#### Error: "Network Error" or CORS Issues
- Verify `REACT_APP_API_URL` is set correctly with `/api` at the end
- Check backend `FRONTEND_URL` matches your Vercel URL exactly
- Ensure backend has redeployed after updating CORS settings

#### Environment variables not working
- Environment variables must start with `REACT_APP_`
- After changing env vars in Vercel, you must **redeploy**
- Check **"Environment Variables"** tab in Vercel project settings

#### Build fails on Vercel
- Check build logs for specific errors
- Ensure `package.json` has correct dependencies
- Verify `build` command works locally: `npm run build`

### Socket.IO Issues

#### Real-time features not working
- Verify `REACT_APP_SOCKET_URL` is set (without `/api`)
- Check browser console for WebSocket connection errors
- Render free tier may have limitations with WebSocket connections
- Consider upgrading to paid tier for stable WebSocket support

### Database Issues

#### Collections not created
- MongoDB Atlas creates collections automatically when first document is inserted
- Try creating a user or posting a job to initialize collections

#### Data not persisting
- Check MongoDB Atlas cluster is not paused
- Verify write permissions for database user
- Check Render logs for database errors

---

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files to GitHub
2. **JWT Secret**: Use a long, random string (at least 32 characters)
3. **MongoDB Password**: Use a strong password with special characters
4. **Admin Credentials**: Use strong passwords for admin accounts
5. **HTTPS**: Both Vercel and Render provide HTTPS by default
6. **Regular Updates**: Keep dependencies updated with `npm update`

---

## Useful Commands

### Local Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start

# Admin Frontend
cd admin-frontend
npm install
npm start
```

### Database Management
```bash
cd backend
npm run create:admin        # Create admin user
npm run init:db            # Initialize database
```

### Git Commands
```bash
git status                 # Check changed files
git add .                  # Stage all changes
git commit -m "message"    # Commit changes
git push origin main       # Deploy to production
```

---

## Cost Summary

| Service | Plan | Cost |
|---------|------|------|
| MongoDB Atlas | M0 Sandbox | **FREE** (512 MB storage) |
| Render | Free Tier | **FREE** (750 hours/month) |
| Vercel | Hobby | **FREE** (unlimited deployments) |
| GitHub | Free | **FREE** (unlimited repos) |
| **Total** | | **$0/month** 🎉 |

**Note**: Free tiers have limitations. For production apps with high traffic, consider upgrading:
- Render: $7/month for starter instance (keeps app running 24/7)
- MongoDB Atlas: $9/month for M10 cluster
- Vercel: $20/month for Pro plan

---

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-production.html)

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review deployment logs on Render/Vercel
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
5. Ensure GitHub repository is up to date

---

## Deployment Checklist

Use this checklist to ensure everything is deployed correctly:

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with proper permissions
- [ ] Network access allows connections from anywhere
- [ ] GitHub repository created and code pushed
- [ ] Backend deployed to Render
- [ ] All backend environment variables set
- [ ] Backend URL obtained and tested
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set with backend URL
- [ ] Admin frontend deployed to Vercel
- [ ] Admin frontend environment variables set
- [ ] Backend CORS updated with Vercel URLs
- [ ] Admin user created in database
- [ ] Test signup, login, and core features
- [ ] Real-time features (chat, notifications) working
- [ ] File uploads working (resumes, profile pictures)

---

## Congratulations! 🎉

Your Online Internship & Job Portal is now live and accessible from anywhere in the world!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Admin: `https://your-admin.vercel.app`
- Backend: `https://your-backend.onrender.com`

Share the frontend URL with your users and start using your platform!
