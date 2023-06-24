
from fastapi import APIRouter , status , HTTPException , Depends
from Server.database import getdb
from Server.routers.auth import getCurrentUser
from sqlalchemy.orm.session import Session
from datetime import datetime , timedelta
from pydantic import Field , Extra

from Server.config import settings
import Server.utils as utils
import Server.schemas as schemas
import Server.models as models
import random as r

from fastapi.security.oauth2 import OAuth2PasswordBearer , OAuth2PasswordRequestForm
from jose import jwt , JWTError

passRouter = APIRouter(tags=["Password"])


SECRET_KEY = settings.SECRET_KEY
ALGORITHN = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_DAYS = settings.ACCESS_TOKEN_EXPIRE_DAYS




# ----------------------------CREATE CHANGE PASSWORD TOKEN-------------------------
def createChangePasswordToken(data:dict = {}):
    toEncode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=settings.CHANGE_PASSWORD_TOKEN_EXPIRE_MINUTES)
    toEncode["exp"] = expire

    token = jwt.encode(toEncode , SECRET_KEY , algorithm=ALGORITHN)
    return token
# ------------------------------------------------------------------



# ----------------------------VERIFY CHANGE PASSWORD TOKEN-------------------------
def verifyChangePasswordToken(token:str):
    try:
        payload = jwt.decode(token , SECRET_KEY , algorithms=ALGORITHN)
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Invalid Credentials")
# ------------------------------------------------------------------



# ----------------------------SEND OTP-------------------------
@passRouter.post("/password/send-otp")
async def sendOtp(data:schemas.sendOtp , db:Session = Depends(getdb)):
    if data.type == "student":
        student = db.query(models.Student).filter(models.Student.email == data.email).first()
        if student == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Student not found")
        
        newOTP = str(r.randrange(10000 , 99999))

        otpRow = db.query(models.StudentOTP).filter(models.StudentOTP.studentEmail == student.email).first()
        if otpRow != None:
            db.delete(otpRow)
            db.commit()

        otpRow = models.StudentOTP(
            studentEmail = student.email,
            otp = newOTP
        )

        db.add(otpRow)
        db.commit()

        subject = "Forgot Password"
        html = f"""<p>OTP to change your password is {newOTP}</p>"""

        await utils.sendMail(recipients=[student.email] , subject=subject , html=html)

        return {"message" : "OTP sent"}

    else:
        admin = db.query(models.Admin).filter(models.Admin.email == data.email).first()
        if admin == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Admin not found")
        
        newOTP = str(r.randrange(10000 , 99999))

        otpRow = db.query(models.AdminOTP).filter(models.AdminOTP.adminEmail == admin.email).first()
        if otpRow != None:
            db.delete(otpRow)
            db.commit()

        otpRow = models.AdminOTP(
            adminEmail = admin.email,
            otp = newOTP
        )

        db.add(otpRow)
        db.commit()

        subject = "Forgot Password"
        html = f"""<p>OTP to change your password is {newOTP}</p>"""

        await utils.sendMail(recipients=[admin.email] , subject=subject , html=html)

        return {"message" : "OTP sent"}
# ------------------------------------------------------------------



# ----------------------------VERIFY OTP-------------------------
@passRouter.post("/password/verify-otp")
def verifyOTP(data:schemas.verifyOtp , db:Session = Depends(getdb)):
    
    if data.type == "student":
        expiryTime = datetime.now() - timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
        expiredOTPs = db.query(models.StudentOTP).filter(models.StudentOTP.created <= expiryTime).all()
        for i in expiredOTPs:
            db.delete(i)
            db.commit()
        

        otpRow = db.query(models.StudentOTP).filter(models.StudentOTP.studentEmail == data.email).first()
        if otpRow == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Otp may be expired")

        if otpRow.otp != data.otp:
            raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE , detail="Invalid OTP")
        
        db.delete(otpRow)
        db.commit()

        passToken = createChangePasswordToken({"email" : data.email , "type" : data.type})
        return {"password_token" : passToken}
    
    else:
        expiryTime = datetime.now() - timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
        expiredOTPs = db.query(models.AdminOTP).filter(models.AdminOTP.created <= expiryTime).all()
        for i in expiredOTPs:
            db.delete(i)
            db.commit()
        

        otpRow = db.query(models.AdminOTP).filter(models.AdminOTP.adminEmail == data.email).first()
        if otpRow == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Otp may be expired")

        if otpRow.otp != data.otp:
            raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE , detail="Invalid OTP")
        
        db.delete(otpRow)
        db.commit()

        passToken = createChangePasswordToken({"email" : data.email , "type" : data.type})
        return {"password_token" : passToken}
# ------------------------------------------------------------------



# ----------------------------CHANGE PASSWORD (FORGOT)-------------------------
@passRouter.post("/password")
def changePasswordForgot(data:schemas.changePasswordForgot , db:Session = Depends(getdb)):
    
    payload = verifyChangePasswordToken(data.token)
    if payload["type"] == "student":
        student = db.query(models.Student).filter(models.Student.email == payload["email"]).first()
        if student == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Student not found")
        
        student.password = utils.hashPassword(data.newPassword)
        
        allTokens = db.query(models.StudentToken).filter(models.StudentToken.studentId == student.id).all()
        for i in allTokens:
            db.delete(i)

        db.commit()
        return {"message" : "Password Changed"}

    else:
        admin = db.query(models.Admin).filter(models.Admin.email == payload["email"]).first()
        if admin == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="admin not found")
        
        admin.password = utils.hashPassword(data.newPassword)
        
        allTokens = db.query(models.AdminToken).filter(models.AdminToken.adminId == admin.id).all()
        for i in allTokens:
            db.delete(i)

        db.commit()

        return {"message" : "Password Changed"}
# ------------------------------------------------------------------



# ----------------------------CHANGE PASSWORD-------------------------
@passRouter.patch("/password" , status_code=status.HTTP_204_NO_CONTENT)
def changePassword(data:schemas.changePassword , user = Depends(getCurrentUser) , db:Session = Depends(getdb)):

    if not utils.verifyPassword(data.oldPassword , user.password):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY , detail="Invalid Credentials")
    
    user.password = utils.hashPassword(data.newPassword)

    if isinstance(user , models.Student):
        allTokens = db.query(models.StudentToken).filter(models.StudentToken.studentId == user.id).all()
        for i in allTokens:
            db.delete(i)
    
    else:
        allTokens = db.query(models.AdminToken).filter(models.AdminToken.adminId == user.id).all()
        for i in allTokens:
            db.delete(i)

    db.commit()
# ------------------------------------------------------------------




