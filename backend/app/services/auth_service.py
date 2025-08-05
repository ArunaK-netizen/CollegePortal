from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.models.student import Student
from app.models.faculty import Faculty
from app.schemas.auth import RegisterRequest
from app.utils.auth import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.utils.email import send_verification_email
from fastapi import HTTPException, status
import uuid

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register_user(self, user_data: RegisterRequest) -> User:
        # Check if user already exists
        result = await self.db.execute(select(User).where(User.email == user_data.email))
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            name=user_data.name,
            email=user_data.email,
            password_hash=hashed_password,
            role=user_data.role
        )
        
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)

        # Create role-specific record
        if user_data.role == "student" and user_data.roll_number and user_data.department_id:
            student = Student(
                user_id=db_user.id,
                roll_number=user_data.roll_number,
                department_id=user_data.department_id
            )
            self.db.add(student)
        elif user_data.role == "faculty" and user_data.department_id:
            faculty = Faculty(
                user_id=db_user.id,
                department_id=user_data.department_id
            )
            self.db.add(faculty)

        await self.db.commit()

        # Send verification email
        # await send_verification_email(user_data.email, str(uuid.uuid4()))

        return db_user

    async def authenticate_user(self, email: str, password: str) -> User:
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is inactive"
            )

        return user

    async def login_user(self, email: str, password: str) -> dict:
        user = await self.authenticate_user(email, password)
        
        access_token = create_access_token(data={"sub": user.email})
        refresh_token = create_refresh_token(data={"sub": user.email})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }