from pydantic import BaseModel
from datetime import datetime
from .user import UserResponse
from .department import DepartmentResponse

class FacultyBase(BaseModel):
    department_id: int

class FacultyCreate(FacultyBase):
    user_id: int

class FacultyUpdate(BaseModel):
    department_id: int

class FacultyResponse(FacultyBase):
    id: int
    user_id: int
    created_at: datetime
    user: UserResponse
    department: DepartmentResponse

    class Config:
        from_attributes = True