from pydantic import BaseModel
from datetime import datetime
from app.models.attendance import AttendanceStatus
from .student import StudentResponse
from .class_schema import ClassResponse

class AttendanceBase(BaseModel):
    student_id: int
    class_id: int
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: int
    created_at: datetime
    student: StudentResponse
    class_session: ClassResponse

    class Config:
        from_attributes = True