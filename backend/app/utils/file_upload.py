import os
import aiofiles
from fastapi import UploadFile, HTTPException, status
from typing import Optional
import uuid
from app.config import settings

ALLOWED_EXTENSIONS = {
    'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx',
    'jpg', 'jpeg', 'png', 'gif', 'txt', 'zip', 'rar'
}

def allowed_file(filename: str) -> bool:
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

async def save_upload_file(upload_file: UploadFile, folder: str = "general") -> str:
    """Save uploaded file and return file path"""
    if not upload_file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file selected"
        )
    
    if not allowed_file(upload_file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type not allowed"
        )
    
    # Check file size
    contents = await upload_file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large"
        )
    
    # Generate unique filename
    file_extension = upload_file.filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    
    # Create directory if it doesn't exist
    upload_dir = os.path.join(settings.UPLOAD_DIR, folder)
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save file
    file_path = os.path.join(upload_dir, unique_filename)
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(contents)
    
    return file_path

def get_file_url(file_path: str) -> str:
    """Get public URL for uploaded file"""
    return f"/uploads/{file_path.replace(settings.UPLOAD_DIR + '/', '')}"