# 🚀 Task Manager API

A full-stack task management application with user authentication, advanced filtering, and real-time updates.

## ✨ Features

- 🔐 **User Authentication** - JWT-based login/registration
- 📝 **Task Management** - Create, read, update, delete tasks
- 🔍 **Advanced Filtering** - Filter by status, priority, due date
- 🔎 **Search Functionality** - Search tasks by title and description
- 📄 **Pagination** - Efficient data loading
- 🎨 **Modern UI** - Responsive design with dark/light themes
- 🔒 **Authorization** - Users can only access their own tasks
- 📊 **Dashboard** - Overview of task statistics

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB with Mongoose ODM
- **Security**: bcryptjs for password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd task-manager-api

# Install dependencies
npm install

# Start the server
npm start
```

### Environment Variables
Create a `.env` file or set environment variables:
```bash
NODE_ENV=development
PORT=3000
DB_URI=mongodb://localhost:27017/tasksDB
JWT_SECRET=your-secret-key
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Task Endpoints
- `GET /api/tasks` - Get all tasks (with filtering/pagination)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Health Check
- `GET /api/health` - Application health status

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Create Tasks**: Add new tasks with title, description, priority, and due date
3. **Manage Tasks**: Edit, delete, or mark tasks as complete
4. **Filter & Search**: Use the advanced filtering options to find specific tasks
5. **Dashboard**: View your task statistics and progress

## 🚀 Deployment

### Quick Deploy to Render
1. **Set up MongoDB Atlas** - Create free cluster
2. **Push to GitHub** - Upload your code
3. **Deploy on Render** - Connect repository and deploy
4. **Set Environment Variables** - Configure production settings

📋 **Detailed deployment guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
✅ **Step-by-step checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

### Deployment Options
- **Render** (Recommended - Free tier available)
- **Heroku** (Paid, but reliable)
- **DigitalOcean App Platform** (Scalable)
- **AWS EC2** (Advanced users)

## 🔧 Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run deploy:check # Check deployment configuration
```

### Project Structure
```
├── app.js                 # Main server file
├── middleware/
│   └── auth.js           # Authentication middleware
├── models/
│   ├── task.js           # Task model
│   └── user.js           # User model
├── routes/
│   ├── auth.js           # Authentication routes
│   └── tasks.js          # Task routes
├── public/
│   ├── index.html        # Frontend application
│   ├── script.js         # Frontend JavaScript
│   └── style.css         # Frontend styles
└── package.json          # Dependencies and scripts
```

## 🛡️ Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Stateless authentication tokens
- **CORS Protection**: Configured for production
- **Input Validation**: Express-validator for data sanitization
- **Security Headers**: XSS protection, content type options
- **Environment Variables**: Secure configuration management

## 📊 Performance Features

- **Database Indexing**: Optimized queries
- **Pagination**: Efficient data loading
- **Connection Pooling**: MongoDB connection optimization
- **Static File Serving**: Optimized frontend delivery
- **Error Handling**: Graceful error management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🎉 What's Next?

Your Task Manager API is now ready for production! Consider these next steps:

- **Automated Testing** - Add unit and integration tests
- **Logging & Monitoring** - Implement Winston or Pino logging
- **Rate Limiting** - Add API rate limiting with express-rate-limit
- **Containerization** - Dockerize your application
- **CI/CD Pipeline** - Set up automated testing and deployment

---

**Built with ❤️ using Node.js, Express, and MongoDB** "# Mini-Build-Project" 
