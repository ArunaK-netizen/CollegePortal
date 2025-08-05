from pydantic import BaseModel
from datetime import datetime, date, time
from .subject import SubjectResponse

class ClassBase(BaseModel):
    subject_id: int
    date: date
    start_time: time
    end_time: time

class ClassCreate(ClassBase):
    pass

class ClassResponse(ClassBase):
    id: int
    created_at: datetime
    subject: SubjectResponse

    class Config:
        from_attributes = True