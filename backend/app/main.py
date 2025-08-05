from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os

from app.routers import auth, users, students, faculty, departments, courses, subjects, classes, attendance, assignments, submissions, announcements, study_materials
from app.config import settings
from app.database import engine, Base

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

app = FastAPI(
    title="College Portal API",
    description="A comprehensive college management system API",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(students.router, prefix="/students", tags=["Students"])
app.include_router(faculty.router, prefix="/faculty", tags=["Faculty"])
app.include_router(departments.router, prefix="/departments", tags=["Departments"])
app.include_router(courses.router, prefix="/courses", tags=["Courses"])
app.include_router(subjects.router, prefix="/subjects", tags=["Subjects"])
app.include_router(classes.router, prefix="/classes", tags=["Classes"])
app.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])
app.include_router(assignments.router, prefix="/assignments", tags=["Assignments"])
app.include_router(submissions.router, prefix="/submissions", tags=["Submissions"])
app.include_router(announcements.router, prefix="/announcements", tags=["Announcements"])
app.include_router(study_materials.router, prefix="/study-materials", tags=["Study Materials"])

@app.get("/")
async def root():
    return {"message": "College Portal API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)