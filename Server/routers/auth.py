
from fastapi import APIRouter , status , HTTPException , Depends
from Server.database import getdb
from sqlalchemy.orm.session import Session
from datetime import datetime , timedelta
from pydantic import Field , Extra

from Server.config import settings
import Server.utils as utils
import Server.schemas as schemas
import Server.models as models

from fastapi.security.oauth2 import OAuth2PasswordBearer , OAuth2PasswordRequestForm
from jose import jwt , JWTError

authRouter = APIRouter(tags=["Authentication"])

oauth2Scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = settings.SECRET_KEY
ALGORITHN = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_DAYS = settings.ACCESS_TOKEN_EXPIRE_DAYS



# ----------------------------CREATE ACCESS TOKEN-------------------------
def createAccessToken(data:dict = {}):
    toEncode = data.copy()

    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
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
        if db.query(models.Token).filter(models.Token.token == token).first() != None:
            student = db.query(models.Student).filter(models.Student.email == str(payload["id"])).first()
            if student != None:
                return student
    else:
        admin = db.query(models.Admin).filter(models.Admin.email == str(payload["id"])).first()
        if admin != None:
            return admin
    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Invalid Credentials")
# ------------------------------------------------------------------



# ----------------------------LOGIN-------------------------
@authRouter.post("/login")
def login(data:OAuth2PasswordRequestForm = Depends() , db:Session = Depends(getdb)):
    print(data.client_id)
    if data.client_id == "student":
        student = db.query(models.Student)
        student = student.filter(models.Student.email == data.username)
        student = student.first()

        if student == None or utils.verifyPassword(data.password , student.password) == False:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Invalid Credentials")
        
        if student.verified == False:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Email not verified")

        payload = {
            "id" : student.email,
            "type" : "student"
        }
        token = createAccessToken(payload)

        tokenRow = models.Token(
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
        admin = db.query(models.Admin)
        admin = admin.filter(models.Admin.email == data.username)
        admin = admin.first()

        if admin == None or utils.verifyPassword(data.password , admin.password) == False:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Invalid Credentials")

        payload = {
            "id" : admin.id,
            "type" : "admin"
        }

        token = createAccessToken(payload)

        return {
            "access_token": token, 
            "token_type": "bearer"
            }
# ------------------------------------------------------------------
















# # ----------------------------LOGIN-------------------------
# @authRouter.post("/login")
# def login(data:schemas.login , db:Session = Depends(getdb)):

#     if data.type == "student":
#         student = db.query(models.Student)
#         student = student.filter(models.Student.email == data.email)
#         student = student.first()

#         if student == None or utils.verifyPassword(data.password , student.password) == False:
#             raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Invalid Credentials")
        
#         if student.verified == False:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Email not verified")

#         payload = {
#             "id" : student.email,
#             "type" : "student"
#         }
#         token = createAccessToken(payload)
#         return {"token" : token}
    
#     else:
#         admin = db.query(models.Admin)
#         admin = admin.filter(models.Admin.email == data.email)
#         admin = admin.first()

#         if admin == None or utils.verifyPassword(data.password , admin.password) == False:
#             raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Invalid Credentials")

#         payload = {
#             "id" : admin.id,
#             "type" : "admin"
#         }

#         token = createAccessToken(payload)
#         return {"token" : token}
# # ------------------------------------------------------------------




# ----------------------------FORGOT PASSWORD-------------------------
# @authRouter.post("/forgotpass")
# def forgotPassword(data:schemas.forgotPass , db:Session = Depends(getCurrentUser)):
#     user = None
#     if data.type == "student":
#         user = db.query(models.Student).filter(models.Student.email == data.email).first()
#         if user == None:
#             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="User not found")

#     else:
#         user = db.query(models.Admin).filter(models.Admin.email == data.email).first()
#         if user == None:
#             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="User not found")


#     html = """<a href="REACT LINK>Change Your Password</a>"""
# ------------------------------------------------------------------

