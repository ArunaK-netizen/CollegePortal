#!/usr/bin/env python3
"""
Script to create an initial admin user
"""
import asyncio
import sys
import os

# Add the parent directory to the path so we can import our app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models.user import User
from app.utils.auth import get_password_hash

async def create_admin_user():
    async with AsyncSessionLocal() as db:
        # Check if admin user already exists
        admin_email = "admin@college.edu"
        
        # Create admin user
        admin_user = User(
            name="System Administrator",
            email=admin_email,
            password_hash=get_password_hash("admin123"),
            role="admin",
            is_active=True,
            is_verified=True
        )
        
        db.add(admin_user)
        await db.commit()
        
        print(f"✅ Admin user created successfully!")
        print(f"📧 Email: {admin_email}")
        print(f"🔑 Password: admin123")
        print(f"⚠️  Please change the password after first login!")

if __name__ == "__main__":
    asyncio.run(create_admin_user())