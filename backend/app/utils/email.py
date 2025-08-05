import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

async def send_verification_email(email: str, token: str):
    """Send verification email to user"""
    subject = "Verify your email - College Portal"
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    
    body = f"""
    <html>
        <body>
            <h2>Welcome to College Portal!</h2>
            <p>Please click the link below to verify your email address:</p>
            <a href="{verification_url}">Verify Email</a>
            <p>If you didn't create an account, please ignore this email.</p>
        </body>
    </html>
    """
    
    await send_email(email, subject, body)


async def send_password_reset_email(email: str, token: str):
    """Send password reset email to user"""
    subject = "Reset your password - College Portal"
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    
    body = f"""
    <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password:</p>
            <a href="{reset_url}">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
        </body>
    </html>
    """
    
    await send_email(email, subject, body)


async def send_email(to_email: str, subject: str, body: str):
    """Send email using SMTP"""
    try:
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
        server.starttls()
        server.login(settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD)
        
        text = msg.as_string()
        server.sendmail(settings.EMAIL_FROM, to_email, text)
        server.quit()
        
        print(f"Email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")