from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models.announcement import Announcement
from app.models.user import User
from app.schemas.announcement import AnnouncementResponse, AnnouncementCreate
from app.utils.auth import get_current_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[AnnouncementResponse])
async def get_announcements(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Announcement)
        .options(selectinload(Announcement.user), selectinload(Announcement.course))
        .order_by(Announcement.created_at.desc())
    )
    announcements = result.scalars().all()
    return announcements

@router.post("/", response_model=AnnouncementResponse)
async def create_announcement(
    announcement_data: AnnouncementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    announcement = Announcement(
        **announcement_data.dict(),
        user_id=current_user.id
    )
    db.add(announcement)
    await db.commit()
    await db.refresh(announcement)
    return announcement

@router.get("/{announcement_id}", response_model=AnnouncementResponse)
async def get_announcement(
    announcement_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Announcement)
        .options(selectinload(Announcement.user), selectinload(Announcement.course))
        .where(Announcement.id == announcement_id)
    )
    announcement = result.scalar_one_or_none()
    
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement not found"
        )
    
    return announcement

@router.put("/{announcement_id}", response_model=AnnouncementResponse)
async def update_announcement(
    announcement_id: int,
    announcement_data: AnnouncementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    result = await db.execute(select(Announcement).where(Announcement.id == announcement_id))
    announcement = result.scalar_one_or_none()
    
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement not found"
        )
    
    # Users can only edit their own announcements (except admins)
    if current_user.role != "admin" and announcement.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to edit this announcement"
        )
    
    update_data = announcement_data.dict()
    for field, value in update_data.items():
        setattr(announcement, field, value)
    
    await db.commit()
    await db.refresh(announcement)
    return announcement

@router.delete("/{announcement_id}")
async def delete_announcement(
    announcement_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    result = await db.execute(select(Announcement).where(Announcement.id == announcement_id))
    announcement = result.scalar_one_or_none()
    
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement not found"
        )
    
    # Users can only delete their own announcements (except admins)
    if current_user.role != "admin" and announcement.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this announcement"
        )
    
    await db.delete(announcement)
    await db.commit()
    return {"message": "Announcement deleted successfully"}