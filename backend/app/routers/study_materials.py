from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models.study_material import StudyMaterial
from app.models.user import User
from app.schemas.study_material import StudyMaterialResponse, StudyMaterialCreate
from app.utils.auth import get_current_user, require_roles
from app.utils.file_upload import save_upload_file, get_file_url

router = APIRouter()

@router.get("/", response_model=List[StudyMaterialResponse])
async def get_study_materials(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(StudyMaterial)
        .options(selectinload(StudyMaterial.subject))
        .order_by(StudyMaterial.created_at.desc())
    )
    materials = result.scalars().all()
    return materials

@router.post("/", response_model=StudyMaterialResponse)
async def create_study_material(
    subject_id: int,
    title: str,
    description: str = None,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    # Save uploaded file
    file_path = await save_upload_file(file, "study_materials")
    file_url = get_file_url(file_path)
    
    material = StudyMaterial(
        subject_id=subject_id,
        title=title,
        description=description,
        file_url=file_url
    )
    
    db.add(material)
    await db.commit()
    await db.refresh(material)
    return material

@router.get("/{material_id}", response_model=StudyMaterialResponse)
async def get_study_material(
    material_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(StudyMaterial)
        .options(selectinload(StudyMaterial.subject))
        .where(StudyMaterial.id == material_id)
    )
    material = result.scalar_one_or_none()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study material not found"
        )
    
    return material

@router.delete("/{material_id}")
async def delete_study_material(
    material_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "faculty"]))
):
    result = await db.execute(select(StudyMaterial).where(StudyMaterial.id == material_id))
    material = result.scalar_one_or_none()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study material not found"
        )
    
    await db.delete(material)
    await db.commit()
    return {"message": "Study material deleted successfully"}