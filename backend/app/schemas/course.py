from pydantic import BaseModel
from datetime import datetime
from .department import DepartmentResponse

class CourseBase(BaseModel):
    name: str
    department_id: int
    semester: int

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int
    created_at: datetime
    department: DepartmentResponse

    class Config:
        from_attributes = True