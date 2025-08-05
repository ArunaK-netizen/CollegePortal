from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .subject import SubjectResponse

class StudyMaterialBase(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None
    file_url: str

class StudyMaterialCreate(StudyMaterialBase):
    pass

class StudyMaterialResponse(StudyMaterialBase):
    id: int
    created_at: datetime
    subject: SubjectResponse

    class Config:
        from_attributes = True