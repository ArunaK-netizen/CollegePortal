from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models.student import Student
from app.models.user import User
from app.models.department import Department
from app.schemas.student import StudentResponse, StudentCreate
from app.utils.auth import get_current_user, require_roles

router = APIRouter()

DEPARTMENT_CODE_MAP = {
    "BCE": "BTECH COMPUTER SCIENCE",
    "BEE": "BTECH ELECTRICAL ENGINEERING",
    "BME": "BTECH MECHANICAL ENGINEERING",
    # Add other mappings as needed
}

async def get_department_id_from_code(db, code: str):
    dept_name = DEPARTMENT_CODE_MAP.get(code)
    if not dept_name:
        return None
    result = await db.execute(select(Department).where(Department.name == dept_name))
    dept = result.scalar_one_or_none()
    return dept.id if dept else None

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
    data = student_data.dict()
    if not data.get("department_id"):
        roll = data["roll_number"]
        code = roll[2:5] if len(roll) >= 5 else None
        dept_id = await get_department_id_from_code(db, code)
        data["department_id"] = dept_id
    student = Student(**data)
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
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalar_one_or_none()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    return student

@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: int,
    student_update: StudentCreate,
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