# Quick Deployment Reference

## MongoDB Atlas Connection String
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Render Environment Variables (Backend)
```
NODE_ENV=production
MONGO_URI=<your-mongodb-atlas-uri>
MONGO_DB_NAME=online_internship_portal
JWT_SECRET=<generate-a-long-random-string>
EMAIL_USER=<your-gmail@gmail.com>
EMAIL_PASSWORD=<gmail-app-password>
PORT=5000
FRONTEND_URL=<your-vercel-frontend-url>
ADMIN_FRONTEND_URL=<your-vercel-admin-url>
```

## Vercel Environment Variables (Frontend)
```
REACT_APP_API_URL=<your-render-backend-url>/api
REACT_APP_SOCKET_URL=<your-render-backend-url>
```

## Vercel Environment Variables (Admin Frontend)
```
REACT_APP_API_URL=<your-render-backend-url>/api
```

## Deployment Order
1. ✅ Setup MongoDB Atlas
2. ✅ Push code to GitHub
3. ✅ Deploy backend to Render
4. ✅ Deploy frontend to Vercel
5. ✅ Deploy admin frontend to Vercel
6. ✅ Update backend CORS with Vercel URLs
7. ✅ Create admin user via Render Shell: `npm run create:admin`

## Important URLs to Remember
- Backend: `https://your-app.onrender.com`
- Frontend: `https://your-app.vercel.app`
- Admin: `https://your-admin.vercel.app`
- MongoDB: `https://cloud.mongodb.com`

## Git Deployment Commands
```bash
git add .
git commit -m "Update message"
git push origin main
```
This automatically triggers deployment on Vercel and Render!

## Testing Your Deployment
1. Visit frontend URL and create an account
2. Login and test features
3. Visit admin URL and login
4. Check notifications and real-time features
5. Test file uploads (resumes, profile pictures)

## Common Issues
- **Backend slow?** → First request after 15 min takes 30-60s (Render free tier)
- **CORS errors?** → Check FRONTEND_URL in Render matches Vercel URL exactly
- **WebSocket not working?** → Verify REACT_APP_SOCKET_URL is set correctly
- **DB connection failed?** → Check MongoDB Atlas allows 0.0.0.0/0 IP access
