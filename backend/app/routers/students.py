from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models.student import Student
from app.models.user import User
from app.schemas.student import StudentResponse, StudentCreate, StudentUpdate
from app.utils.auth import get_current_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[StudentResponse])
async def get_students(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    result = await db.execute(
        select(Student)
        .options(selectinload(Student.user), selectinload(Student.department))
        .order_by(Student.created_at.desc())
    )
    students = result.scalars().all()
    return students

@router.post("/", response_model=StudentResponse)
async def create_student(
    student_data: StudentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    # Check if roll number already exists
    result = await db.execute(select(Student).where(Student.roll_number == student_data.roll_number))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Roll number already exists"
        )
    
    student = Student(**student_data.dict())
    db.add(student)
    await db.commit()
    await db.refresh(student)
    return student

@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Student)
        .options(selectinload(Student.user), selectinload(Student.department))
        .where(Student.id == student_id)
    )
    student = result.scalar_one_or_none()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Students can only access their own data
    if current_user.role == "student" and student.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this student's data"
        )
    
    return student

@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: int,
    student_update: StudentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalar_one_or_none()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    update_data = student_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)
    
    await db.commit()
    await db.refresh(student)
    return student

@router.delete("/{student_id}")
async def delete_student(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalar_one_or_none()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    await db.delete(student)
    await db.commit()
    return {"message": "Student deleted successfully"}