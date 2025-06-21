# 🚀 Task Manager API - Deployment Guide

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (for production database)
- [GitHub](https://github.com/) account
- [Render](https://render.com/) account (free tier available)

## 🎯 Deployment Options

### Option 1: Render (Recommended - Free & Easy)

#### Step 1: Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user with read/write permissions
5. Get your connection string

#### Step 2: Deploy to Render
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `task-manager-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### Step 3: Set Environment Variables
In Render dashboard, go to your service → Environment → Add Environment Variables:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-here
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/tasksDB?retryWrites=true&w=majority
```

#### Step 4: Deploy
Click "Create Web Service" and wait for deployment to complete.

### Option 2: Heroku

#### Step 1: Install Heroku CLI
```bash
npm install -g heroku
```

#### Step 2: Create Heroku App
```bash
heroku create your-task-manager-app
```

#### Step 3: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key-here
heroku config:set DB_URI=mongodb+srv://username:password@cluster.mongodb.net/tasksDB
```

#### Step 4: Deploy
```bash
git push heroku main
```

### Option 3: DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
2. Connect your GitHub repository
3. Configure as Node.js app
4. Set environment variables
5. Deploy

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `DB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `CORS_ORIGIN` | Allowed origins | `https://yourdomain.com` |

## 🛡️ Security Checklist

- [ ] JWT_SECRET is set and secure
- [ ] Database connection uses SSL
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] HTTPS is enabled
- [ ] Security headers are active

## 📊 Monitoring

### Health Check Endpoint
Your app includes a health check at `/api/health` that returns:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "environment": "production",
  "version": "1.0.0"
}
```

### Logs
Monitor your application logs in your deployment platform's dashboard.

## 🔄 Continuous Deployment

### Render
- Automatic deployments on git push
- Manual deployments available
- Rollback to previous versions

### Heroku
```bash
git push heroku main  # Deploy
heroku rollback       # Rollback
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DB_URI format
   - Verify network access in MongoDB Atlas
   - Check IP whitelist

2. **JWT Errors**
   - Ensure JWT_SECRET is set
   - Check token expiration

3. **CORS Errors**
   - Verify CORS_ORIGIN setting
   - Check frontend URL

4. **Port Issues**
   - Use PORT environment variable
   - Don't hardcode port numbers

### Debug Commands
```bash
# Check environment
npm run deploy:check

# Test locally with production env
NODE_ENV=production npm start

# Check health endpoint
curl https://your-app.onrender.com/api/health
```

## 📈 Performance Optimization

1. **Database Indexing**
   - Text indexes for search
   - Compound indexes for queries

2. **Caching**
   - Consider Redis for session storage
   - Implement response caching

3. **CDN**
   - Use CDN for static files
   - Optimize images and assets

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practices-production.html)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

## 🎉 Success!

Once deployed, your Task Manager API will be available at:
- **API**: `https://your-app.onrender.com/api`
- **Frontend**: `https://your-app.onrender.com`
- **Health Check**: `https://your-app.onrender.com/api/health`

Share your deployed URL and start managing tasks from anywhere! 🚀 