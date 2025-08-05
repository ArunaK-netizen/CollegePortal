from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models.attendance import Attendance
from app.models.student import Student
from app.models.user import User
from app.schemas.attendance import AttendanceResponse, AttendanceCreate
from app.utils.auth import get_current_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[AttendanceResponse])
async def get_attendance(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    result = await db.execute(
        select(Attendance)
        .options(selectinload(Attendance.student), selectinload(Attendance.class_session))
        .order_by(Attendance.created_at.desc())
    )
    attendance = result.scalars().all()
    return attendance

@router.post("/", response_model=AttendanceResponse)
async def create_attendance(
    attendance_data: AttendanceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    # Check if attendance already exists for this student and class
    result = await db.execute(
        select(Attendance).where(
            Attendance.student_id == attendance_data.student_id,
            Attendance.class_id == attendance_data.class_id
        )
    )
    existing_attendance = result.scalar_one_or_none()
    
    if existing_attendance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance already marked for this student and class"
        )
    
    attendance = Attendance(**attendance_data.dict())
    db.add(attendance)
    await db.commit()
    await db.refresh(attendance)
    return attendance

@router.get("/student/{student_id}", response_model=List[AttendanceResponse])
async def get_student_attendance(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Students can only view their own attendance
    if current_user.role == "student":
        result = await db.execute(select(Student).where(Student.user_id == current_user.id))
        student = result.scalar_one_or_none()
        if not student or student.id != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this attendance"
            )
    
    result = await db.execute(
        select(Attendance)
        .options(selectinload(Attendance.student), selectinload(Attendance.class_session))
        .where(Attendance.student_id == student_id)
        .order_by(Attendance.created_at.desc())
    )
    attendance = result.scalars().all()
    return attendance

@router.put("/{attendance_id}", response_model=AttendanceResponse)
async def update_attendance(
    attendance_id: int,
    attendance_data: AttendanceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    result = await db.execute(select(Attendance).where(Attendance.id == attendance_id))
    attendance = result.scalar_one_or_none()
    
    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found"
        )
    
    attendance.status = attendance_data.status
    await db.commit()
    await db.refresh(attendance)
    return attendance

@router.delete("/{attendance_id}")
async def delete_attendance(
    attendance_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    result = await db.execute(select(Attendance).where(Attendance.id == attendance_id))
    attendance = result.scalar_one_or_none()
    
    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found"
        )
    
    await db.delete(attendance)
    await db.commit()
    return {"message": "Attendance record deleted successfully"}