# 🎓 College Portal - Full Stack Application

A comprehensive college management system built with FastAPI (Backend) and Next.js (Frontend).

## 🏗️ Architecture

- **Backend**: FastAPI + SQLAlchemy + PostgreSQL + JWT Auth
- **Frontend**: Next.js + Tailwind CSS + Axios
- **Database**: PostgreSQL with Alembic migrations
- **Authentication**: JWT with role-based access control
- **Deployment**: Docker + Railway/Render + Vercel

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)

### 1. Clone and Setup Environment

```bash
git clone <repository-url>
cd college-portal

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Update the environment variables in both files
```

### 2. Run with Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend alembic upgrade head

# Create initial admin user
docker-compose exec backend python scripts/create_admin.py
```

### 3. Access Applications

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (development only)
- **Database**: localhost:5432

### 4. Default Admin Credentials

- **Email**: admin@college.edu
- **Password**: admin123

## 🔧 Local Development

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📊 Database Schema

### Core Entities
- **Users**: Authentication and user management
- **Students/Faculty**: Role-specific information
- **Departments**: Academic departments
- **Courses**: Academic programs
- **Subjects**: Course subjects
- **Classes**: Scheduled classes
- **Attendance**: Student attendance tracking
- **Assignments**: Assignment management
- **Submissions**: Student submissions
- **Announcements**: Course announcements
- **StudyMaterial**: Educational resources

## 🔐 Authentication & Authorization

### Roles
- **Admin**: Full system access, user management
- **Faculty**: Course management, attendance, grading
- **Student**: View attendance, submit assignments, access materials

### JWT Tokens
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days)
- Automatic token refresh on frontend

## 📁 Project Structure

```
college-portal/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── routers/        # API route handlers
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities (auth, email, etc.)
│   ├── alembic/            # Database migrations
│   ├── tests/              # Test files
│   └── requirements.txt
├── frontend/               # Next.js application
│   ├── components/         # React components
│   ├── pages/              # Next.js pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and configurations
│   └── styles/             # Tailwind CSS styles
├── docker-compose.yml      # Development environment
├── docker-compose.prod.yml # Production environment
└── .github/workflows/      # CI/CD pipelines
```

## 🚀 Deployment

### Railway + Supabase (Backend)

1. **Create Railway Account** and install CLI
2. **Deploy Backend**:
   ```bash
   cd backend
   railway login
   railway init
   railway add
   railway deploy
   ```
3. **Set Environment Variables** in Railway dashboard
4. **Run Migrations**:
   ```bash
   railway run alembic upgrade head
   ```

### Vercel (Frontend)

1. **Connect GitHub Repository** to Vercel
2. **Set Environment Variables**:
   - `NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app`
3. **Deploy** automatically via Git push

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/college_portal
JWT_SECRET_KEY=your-super-secret-jwt-key
JWT_REFRESH_SECRET_KEY=your-super-secret-refresh-key
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 API Documentation

When running in development mode, visit http://localhost:8000/docs for interactive API documentation.

### Key Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /users/me` - Get current user
- `GET /attendance/student/{student_id}` - Student attendance
- `POST /assignments` - Create assignment
- `POST /submissions` - Submit assignment

## 🔄 CI/CD Pipeline

GitHub Actions workflows included for:
- **Backend**: Testing, linting, Docker build
- **Frontend**: Testing, linting, build verification
- **Deployment**: Automatic deployment on main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API docs at `/docs`