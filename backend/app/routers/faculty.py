from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models.faculty import Faculty
from app.models.user import User
from app.schemas.faculty import FacultyResponse, FacultyCreate, FacultyUpdate
from app.utils.auth import get_current_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[FacultyResponse])
async def get_faculty(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    result = await db.execute(
        select(Faculty)
        .options(selectinload(Faculty.user), selectinload(Faculty.department))
        .order_by(Faculty.created_at.desc())
    )
    faculty = result.scalars().all()
    return faculty

@router.post("/", response_model=FacultyResponse)
async def create_faculty(
    faculty_data: FacultyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    faculty = Faculty(**faculty_data.dict())
    db.add(faculty)
    await db.commit()
    await db.refresh(faculty)
    return faculty

@router.get("/{faculty_id}", response_model=FacultyResponse)
async def get_faculty_member(
    faculty_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Faculty)
        .options(selectinload(Faculty.user), selectinload(Faculty.department))
        .where(Faculty.id == faculty_id)
    )
    faculty = result.scalar_one_or_none()
    
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty member not found"
        )
    
    return faculty

@router.put("/{faculty_id}", response_model=FacultyResponse)
async def update_faculty(
    faculty_id: int,
    faculty_update: FacultyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    result = await db.execute(select(Faculty).where(Faculty.id == faculty_id))
    faculty = result.scalar_one_or_none()
    
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty member not found"
        )
    
    update_data = faculty_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(faculty, field, value)
    
    await db.commit()
    await db.refresh(faculty)
    return faculty

@router.delete("/{faculty_id}")
async def delete_faculty(
    faculty_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    result = await db.execute(select(Faculty).where(Faculty.id == faculty_id))
    faculty = result.scalar_one_or_none()
    
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty member not found"
        )
    
    await db.delete(faculty)
    await db.commit()
    return {"message": "Faculty member deleted successfully"}