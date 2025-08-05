from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .subject import SubjectResponse

class AssignmentBase(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None
    deadline: datetime

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentResponse(AssignmentBase):
    id: int
    created_at: datetime
    subject: SubjectResponse

    class Config:
        from_attributes = True