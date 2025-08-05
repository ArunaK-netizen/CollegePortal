from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models.class_model import Class
from app.models.user import User
from app.schemas.class_schema import ClassResponse, ClassCreate
from app.utils.auth import get_current_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[ClassResponse])
async def get_classes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Class)
        .options(selectinload(Class.subject))
        .order_by(Class.date.desc(), Class.start_time)
    )
    classes = result.scalars().all()
    return classes

@router.post("/", response_model=ClassResponse)
async def create_class(
    class_data: ClassCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    class_session = Class(**class_data.dict())
    db.add(class_session)
    await db.commit()
    await db.refresh(class_session)
    return class_session

@router.get("/{class_id}", response_model=ClassResponse)
async def get_class(
    class_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Class)
        .options(selectinload(Class.subject))
        .where(Class.id == class_id)
    )
    class_session = result.scalar_one_or_none()
    
    if not class_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    return class_session

@router.delete("/{class_id}")
async def delete_class(
    class_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    result = await db.execute(select(Class).where(Class.id == class_id))
    class_session = result.scalar_one_or_none()
    
    if not class_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    await db.delete(class_session)
    await db.commit()
    return {"message": "Class deleted successfully"}