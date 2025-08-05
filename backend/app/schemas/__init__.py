from .user import *
from .student import *
from .faculty import *
from .department import *
from .course import *
from .subject import *
from .class_schema import *
from .attendance import *
from .assignment import *
from .submission import *
from .announcement import *
from .study_material import *
from .auth import *

__all__ = [
    "UserCreate", "UserResponse", "UserUpdate",
    "StudentCreate", "StudentResponse", "StudentUpdate",
    "FacultyCreate", "FacultyResponse", "FacultyUpdate",
    "DepartmentCreate", "DepartmentResponse",
    "CourseCreate", "CourseResponse",
    "SubjectCreate", "SubjectResponse",
    "ClassCreate", "ClassResponse",
    "AttendanceCreate", "AttendanceResponse",
    "AssignmentCreate", "AssignmentResponse",
    "SubmissionCreate", "SubmissionResponse",
    "AnnouncementCreate", "AnnouncementResponse",
    "StudyMaterialCreate", "StudyMaterialResponse",
    "Token", "TokenData", "LoginRequest", "RegisterRequest"
]