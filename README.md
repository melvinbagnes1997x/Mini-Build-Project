# 🚀 Task Manager Pro

A full-stack task management application with user authentication, advanced filtering, and real-time updates.

---

## ✨ Features

- 🔐 **User Authentication** – Secure JWT-based registration and login
- 📝 **Task Management** – Create, read, update, and delete tasks
- 🔍 **Advanced Filtering** – Filter tasks by status, priority, and due date
- 🔎 **Search Functionality** – Search tasks by title or description
- 📄 **Pagination** – Efficiently load and browse large task lists
- 🎨 **Modern UI** – Responsive design with light and dark themes
- 🔒 **Authorization** – Users can only access and manage their own tasks
- 📊 **Dashboard** – Visual overview of task statistics and progress

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** MongoDB with Mongoose ODM
- **Security:** bcryptjs for password hashing
- **Testing:** Jest, Supertest, Cypress

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd <your-project-directory>

# Install dependencies
npm install

# Create a config.env file (see below)
cp config.env.example config.env

# Start the server
npm start
```

---

## ⚙️ Environment Variables

Create a `config.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
DB_URI=mongodb://localhost:27017/tasksDB
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

For **production** (e.g., Render), use your MongoDB Atlas URI and set `NODE_ENV=production`.

---

## 📖 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full details.

### Authentication Endpoints

- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – User login
- `GET /api/auth/profile` – Get user profile

### Task Endpoints

- `GET /api/tasks` – Get all tasks (with filtering/pagination)
- `POST /api/tasks` – Create new task
- `GET /api/tasks/:id` – Get specific task
- `PUT /api/tasks/:id` – Update task
- `DELETE /api/tasks/:id` – Delete task

### Health Check

- `GET /api/health` – Application health status

---

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Cypress E2E Tests

```bash
npx cypress run
# or for interactive mode
npx cypress open
```

Test files are in the `tests/` and `cypress/e2e/` directories.

---

## 🐳 Docker Setup

You can run the app and MongoDB together using Docker Compose:

```bash
docker-compose up --build
```

- The app will be available at [http://localhost:3000](http://localhost:3000)
- MongoDB will be available at `mongodb://localhost:27017`

To stop and remove containers, networks, and volumes:

```bash
docker-compose down
```

---

## 🚀 Deployment

### Deploy to Render

1. **Set up MongoDB Atlas** – Create a free cluster
2. **Push to GitHub** – Upload your code
3. **Deploy on Render** – Connect repository and deploy
4. **Set Environment Variables** – Configure production settings

See [DEPLOYMENT.md](./DEPLOYMENT.md) and [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for step-by-step instructions.

---

## 🛡️ Security Features

- Password hashing (bcryptjs)
- JWT authentication
- CORS protection
- Input validation (express-validator)
- Security headers
- Environment variable configuration

---

## 📊 Performance Features

- Database indexing
- Pagination
- Connection pooling
- Static file serving
- Error handling
- Caching middleware

---

## 📋 Project Structure

```
├── app.js                 # Main server file
├── middleware/
│   └── auth.js            # Authentication middleware
│   └── cache.js           # Caching middleware
├── models/
│   ├── task.js            # Task model
│   └── user.js            # User model
├── routes/
│   ├── auth.js            # Authentication routes
│   └── tasks.js           # Task routes
├── public/
│   ├── index.html         # Frontend application
│   ├── script.js          # Frontend JavaScript
│   └── style.css          # Frontend styles
├── tests/                 # Jest/Supertest tests
├── cypress/               # Cypress E2E tests
├── Dockerfile
├── docker-compose.yml
├── config.env
├── README.md
├── API_DOCUMENTATION.md
├── DEPLOYMENT.md
├── DEPLOYMENT_CHECKLIST.md
└── PROJECT_SUMMARY.md
```

---

## 🎯 Usage

1. **Register/Login:** Create an account or sign in
2. **Create Tasks:** Add new tasks with title, description, priority, and due date
3. **Manage Tasks:** Edit, delete, or mark tasks as complete
4. **Filter & Search:** Use advanced filtering options to find specific tasks
5. **Dashboard:** View your task statistics and progress

---

## 🏁 Post-Deployment Verification

- Visit your deployed URL (e.g., `https://your-app.onrender.com`)
- Test all endpoints and UI features
- Check `/api/health` for status
- Register/login, create/manage tasks, and verify everything works
- All documentation is up to date

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

This project is licensed under the ISC License.

---

**Built with ❤️ by [KinuuHiru] using Node.js, Express, and MongoDB**

---

## ✅ Final Checklist

- [x] All features implemented and tested
- [x] All tests passing (unit, integration, E2E)
- [x] Production deployment complete
- [x] Documentation up to date
- [x] Post-deployment verification done

---

**Congratulations! Your Task Manager Pro is 100% complete and production-ready!**
