from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, Token
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(
    user_data: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    auth_service = AuthService(db)
    user = await auth_service.register_user(user_data)
    return user

@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    auth_service = AuthService(db)
    return await auth_service.login_user(login_data.email, login_data.password)

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.post("/refresh", response_model=Token)
async def refresh_token(
    current_user: User = Depends(get_current_user)
):
    # In a real implementation, you'd verify the refresh token
    # For now, we'll just create new tokens
    auth_service = AuthService(None)
    return await auth_service.login_user(current_user.email, "")