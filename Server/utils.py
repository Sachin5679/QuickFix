
# ----------------------------HASHING-------------------------
from passlib.context import CryptContext

context = CryptContext(schemes=["bcrypt"] , deprecated="auto")

def hashPassword(password):
    return context.hash(password)

def verifyPassword(enteredPassword , hashedPassword):
    return context.verify(enteredPassword , hashedPassword) 
# ------------------------------------------------------------------


# ----------------------------MAILING-------------------------
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig , MessageType
from Server.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME = settings.MAIL_USERNAME,
    MAIL_PASSWORD = settings.MAIL_PASSWORD,
    MAIL_FROM = settings.MAIL_FROM,
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_FROM_NAME="QuickFix",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

fastmail = FastMail(conf)

async def sendMail(recipients , subject , html):

    message = MessageSchema(
        subject=subject,
        body=html,
        recipients=recipients,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)

    return True
# ------------------------------------------------------------------


# ----------------------------CLOUDINARY-------------------------
import cloudinary
from cloudinary import uploader

cloudinary.config( 
  cloud_name = settings.CLOUD_NAME, 
  api_key = settings.API_KEY, 
  api_secret = settings.API_SECRET 
)

def uploadImage(file):
    upload_params = {
        "transformation": [ {"quality": "auto:low"}, ]
    }
    url = uploader.upload(file, **upload_params)
    return url["secure_url"] , url["public_id"]

def deleteImage(publicId):
    result = uploader.destroy(public_id=publicId)
    return result["result"] == "ok"
# ------------------------------------------------------------------

