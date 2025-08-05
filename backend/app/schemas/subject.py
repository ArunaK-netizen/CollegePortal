from pydantic import BaseModel
from datetime import datetime
from .course import CourseResponse
from .faculty import FacultyResponse

class SubjectBase(BaseModel):
    name: str
    course_id: int
    faculty_id: int

class SubjectCreate(SubjectBase):
    pass

class SubjectResponse(SubjectBase):
    id: int
    created_at: datetime
    course: CourseResponse
    faculty: FacultyResponse

    class Config:
        from_attributes = True