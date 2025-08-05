from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import UserResponse
from .department import DepartmentResponse

class StudentBase(BaseModel):
    roll_number: str
    department_id: Optional[int] = None

class StudentCreate(StudentBase):
    user_id: int

class StudentUpdate(BaseModel):
    roll_number: Optional[str] = None
    department_id: Optional[int] = None

class StudentResponse(StudentBase):
    id: int
    user_id: int
    created_at: datetime
    user: Optional[UserResponse] = None
    department: Optional[DepartmentResponse] = None

    class Config:
        from_attributes = True