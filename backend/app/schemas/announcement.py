from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import UserResponse
from .course import CourseResponse

class AnnouncementBase(BaseModel):
    title: str
    content: str
    course_id: Optional[int] = None

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementResponse(AnnouncementBase):
    id: int
    user_id: int
    created_at: datetime
    user: UserResponse
    course: Optional[CourseResponse] = None

    class Config:
        from_attributes = True