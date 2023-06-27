
from fastapi import APIRouter , status , HTTPException , Depends , BackgroundTasks
from Server.database import getdb
from sqlalchemy.orm.session import Session
from datetime import datetime , timedelta
from pydantic import Field , Extra
import asyncio

from Server.config import settings
import Server.utils as utils
import Server.schemas as schemas
import Server.models as models
from Server.database import sessionlocal

from fastapi.security.oauth2 import OAuth2PasswordBearer , OAuth2PasswordRequestForm
from jose import jwt , JWTError

authRouter = APIRouter(tags=["Authentication"])

oauth2Scheme = OAuth2PasswordBearer(tokenUrl="login-form")

SECRET_KEY = settings.SECRET_KEY
ALGORITHN = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES= settings.ACCESS_TOKEN_EXPIRE_MINUTES



# ----------------------------CREATE ACCESS TOKEN-------------------------
def createAccessToken(data:dict = {}):
    toEncode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    toEncode["exp"] = expire

    token = jwt.encode(toEncode , SECRET_KEY , algorithm=ALGORITHN)
    return token
# ------------------------------------------------------------------



# ----------------------------VERIFY ACCESS TOKEN-------------------------
def verifyAccessToken(token:str):
    try:

        payload = jwt.decode(token , SECRET_KEY , algorithms=ALGORITHN)
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Invalid Credentials")
# ------------------------------------------------------------------



# ----------------------------GET CURRENT USER-------------------------
def getCurrentUser(token:str = Depends(oauth2Scheme) , db:Session = Depends(getdb)):
    payload = verifyAccessToken(token)

    if payload["type"] == "student":
        if db.query(models.StudentToken).filter(models.StudentToken.token == token).first() != None:
            student = db.query(models.Student).filter(models.Student.email == str(payload["id"])).first()
            if student != None:
                return student
    else:
        if db.query(models.AdminToken).filter(models.AdminToken.token == token).first() != None:
            admin = db.query(models.Admin).filter(models.Admin.email == str(payload["id"])).first()
            if admin != None:
                return admin
    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Invalid Credentials")
# ------------------------------------------------------------------



# ----------------------------LOGIN (FORM DATA)-------------------------
@authRouter.post("/login-form")
def login(data:OAuth2PasswordRequestForm = Depends() , db:Session = Depends(getdb)):

    if data.client_id == "student":
        student = db.query(models.Student).filter(models.Student.email == data.username).first()

        if student == None or utils.verifyPassword(data.password , student.password) == False:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Invalid Credentials")
        
        if student.verified == False:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Email is not verified")

        payload = {
            "id" : student.email,
            "type" : "student"
        }
        token = createAccessToken(payload)

        tokenRow = models.StudentToken(
            studentId = student.id,
            token = token
        )
        db.add(tokenRow)
        db.commit()
        
        return {
            "access_token": token, 
            "token_type": "bearer"
            }
    
    else:
        admin = db.query(models.Admin).filter(models.Admin.email == data.username).first()

        if admin == None or utils.verifyPassword(data.password , admin.password) == False:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Invalid Credentials")

        payload = {
            "id" : admin.email,
            "type" : "admin"
        }
        token = createAccessToken(payload)

        tokenRow = models.AdminToken(
            adminId = admin.id,
            token = token
        )
        db.add(tokenRow)
        db.commit()

        return {
            "access_token": token, 
            "token_type": "bearer"
            }
# ------------------------------------------------------------------



# ----------------------------LOGIN (JSON DATA)-------------------------
@authRouter.post("/login")
def login(data:schemas.login , db:Session = Depends(getdb)):

    if data.type == "student":
        student = db.query(models.Student).filter(models.Student.email == data.email).first()

        if student == None or utils.verifyPassword(data.password , student.password) == False:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Invalid Credentials")
        
        if student.verified == False:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Email is not verified")

        payload = {
            "id" : student.email,
            "type" : "student"
        }
        token = createAccessToken(payload)

        tokenRow = models.StudentToken(
            studentId = student.id,
            token = token
        )
        db.add(tokenRow)
        db.commit()
        
        return {
            "access_token": token, 
            "token_type": "bearer"
            }
    
    else:
        admin = db.query(models.Admin).filter(models.Admin.email == data.email).first()

        if admin == None or utils.verifyPassword(data.password , admin.password) == False:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Invalid Credentials")

        payload = {
            "id" : admin.email,
            "type" : "admin"
        }
        token = createAccessToken(payload)

        tokenRow = models.AdminToken(
            adminId = admin.id,
            token = token
        )
        db.add(tokenRow)
        db.commit()

        return {
            "access_token": token, 
            "token_type": "bearer"
            }
# ------------------------------------------------------------------


# ----------------------------DELETE EXPIRED TOKENS (EVERY 30 MIN)-------------------------
async def deleteAllExpiredTokens():
    print("Deleting Expired Tokens")

    db:Session = sessionlocal()
    expTime = datetime.now() - timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    allExpiredStudetTokens = db.query(models.StudentToken).filter(models.StudentToken.created <= expTime).all()
    allExpiredAdminTokens = db.query(models.AdminToken).filter(models.AdminToken.created <= expTime).all()

    cnt = 0
    for i in allExpiredStudetTokens:
        db.delete(i)
        cnt+=1

    for i in allExpiredAdminTokens:
        db.delete(i)
        cnt+=1
    
    db.commit()
    db.close()

    print(f"Deleted {cnt} Expired Tokens")


def schedule_task():
    loop = asyncio.get_event_loop()
    loop.create_task(deleteAllExpiredTokens())
    loop.call_later(settings.DELETE_EXPIRED_TOKEN_EVERY_MINUTES*60, schedule_task)


@authRouter.on_event("startup")
async def startup_event():
    schedule_task()
# ------------------------------------------------------------------
