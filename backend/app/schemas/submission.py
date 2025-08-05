from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .assignment import AssignmentResponse
from .student import StudentResponse

class SubmissionBase(BaseModel):
    assignment_id: int
    student_id: int
    file_url: Optional[str] = None

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionUpdate(BaseModel):
    grade: Optional[float] = None
    feedback: Optional[str] = None

class SubmissionResponse(SubmissionBase):
    id: int
    grade: Optional[float] = None
    feedback: Optional[str] = None
    submitted_at: datetime
    assignment: AssignmentResponse
    student: StudentResponse

    class Config:
        from_attributes = True