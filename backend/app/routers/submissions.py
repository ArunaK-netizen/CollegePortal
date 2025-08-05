from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.database import get_db
from app.models.submission import Submission
from app.models.student import Student
from app.models.user import User
from app.schemas.submission import SubmissionResponse, SubmissionCreate, SubmissionUpdate
from app.utils.auth import get_current_user, require_roles
from app.utils.file_upload import save_upload_file, get_file_url

router = APIRouter()

@router.get("/", response_model=List[SubmissionResponse])
async def get_submissions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    result = await db.execute(
        select(Submission)
        .options(selectinload(Submission.assignment), selectinload(Submission.student))
        .order_by(Submission.submitted_at.desc())
    )
    submissions = result.scalars().all()
    return submissions

@router.post("/", response_model=SubmissionResponse)
async def create_submission(
    assignment_id: int,
    file: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["student"]))
):
    # Get student record
    result = await db.execute(select(Student).where(Student.user_id == current_user.id))
    student = result.scalar_one_or_none()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student record not found"
        )
    
    # Check if submission already exists
    result = await db.execute(
        select(Submission).where(
            Submission.assignment_id == assignment_id,
            Submission.student_id == student.id
        )
    )
    existing_submission = result.scalar_one_or_none()
    
    if existing_submission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Submission already exists for this assignment"
        )
    
    file_url = None
    if file:
        file_path = await save_upload_file(file, "submissions")
        file_url = get_file_url(file_path)
    
    submission = Submission(
        assignment_id=assignment_id,
        student_id=student.id,
        file_url=file_url
    )
    
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    return submission

@router.get("/student/{student_id}", response_model=List[SubmissionResponse])
async def get_student_submissions(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Students can only view their own submissions
    if current_user.role == "student":
        result = await db.execute(select(Student).where(Student.user_id == current_user.id))
        student = result.scalar_one_or_none()
        if not student or student.id != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view these submissions"
            )
    
    result = await db.execute(
        select(Submission)
        .options(selectinload(Submission.assignment), selectinload(Submission.student))
        .where(Submission.student_id == student_id)
        .order_by(Submission.submitted_at.desc())
    )
    submissions = result.scalars().all()
    return submissions

@router.put("/{submission_id}/grade", response_model=SubmissionResponse)
async def grade_submission(
    submission_id: int,
    submission_update: SubmissionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    result = await db.execute(select(Submission).where(Submission.id == submission_id))
    submission = result.scalar_one_or_none()
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    if submission_update.grade is not None:
        submission.grade = submission_update.grade
    if submission_update.feedback is not None:
        submission.feedback = submission_update.feedback
    
    await db.commit()
    await db.refresh(submission)
    return submission

@router.delete("/{submission_id}")
async def delete_submission(
    submission_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Submission).where(Submission.id == submission_id))
    submission = result.scalar_one_or_none()
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    # Students can only delete their own submissions
    if current_user.role == "student":
        result = await db.execute(select(Student).where(Student.user_id == current_user.id))
        student = result.scalar_one_or_none()
        if not student or submission.student_id != student.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this submission"
            )
    
    await db.delete(submission)
    await db.commit()
    return {"message": "Submission deleted successfully"}