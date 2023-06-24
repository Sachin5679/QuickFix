
from fastapi import APIRouter , status , HTTPException , Depends
from Server.database import getdb
from sqlalchemy.orm.session import Session
import secrets

import Server.config as config
import Server.utils as utils
import Server.schemas as schemas
import Server.models as models
from Server.routers.auth import getCurrentUser

userRouter = APIRouter(tags=["Student"])


# ----------------------------CREATE STUDENT-------------------------
@userRouter.post("/student" , status_code=status.HTTP_201_CREATED)
async def signupStudent(data : schemas.signupStudent , db:Session = Depends(getdb)):

    check = db.query(models.Student)
    check = check.filter(models.Student.email == data.email)
    check = check.first()
    if check != None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail="Student with this email alreay exits")

    newStudent = models.Student(
        name = data.name,
        email = data.email,
        verified = False,
        hostel = data.hostel,
        room = data.room,
        password = utils.hashPassword(data.password)
    )

    db.add(newStudent)
    db.commit()
    db.refresh(newStudent)


    secret = secrets.token_urlsafe(32)

    subject = "Email Verification"
    html = f"""<a href='http://192.168.69.167:8000/verify/{secret}'>Click here to verify your email</a>"""

    await utils.sendMail(recipients=[data.email] , subject=subject , html=html)

    secretRow = models.EmailVerify(
        studentId = newStudent.id,
        secret = secret
    )

    db.add(secretRow)
    db.commit()

    return {"message" : "Account Created"}
# ------------------------------------------------------------------


# ----------------------------GET MY DETAILS-------------------------
@userRouter.get("/student/me" , response_model=schemas.returnStudent)
def getMyDetails(student:models.Student = Depends(getCurrentUser)):
    if not isinstance(student , models.Student):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Operation not allowed")

    return student
# ------------------------------------------------------------------


# ----------------------------GET ALL STUDENTS-------------------------
@userRouter.get("/student" , response_model=list[schemas.returnStudent])
def getAllStudents(db:Session = Depends(getdb) , user = Depends(getCurrentUser)):

    allStudents = db.query(models.Student).all()
    return allStudents
# ------------------------------------------------------------------


# ----------------------------GET SPECIFIC STUDENT-------------------------
@userRouter.get("/student/{id}" , response_model=schemas.returnStudent)
def getSpecificStudent(id:int , db:Session = Depends(getdb) , user = Depends(getCurrentUser)):

    if isinstance(user , models.Student) and id == user.id:
        return user

    student = db.query(models.Student)
    student = student.filter(models.Student.id == id)
    student = student.first()

    if student == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="student with this id doesn't exist")

    return student
# ------------------------------------------------------------------



# ----------------------------UPDATE STUDENT PROFILE-------------------------
@userRouter.put("/student/me" , response_model=schemas.returnStudent)
def updateStudentProfile(data:schemas.updateStudent , student:models.Student = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    if not isinstance(student , models.Student):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Not allowed")
    
    if data.name != None:
        student.name = data.name
    if data.hostel != None:
        student.hostel = data.hostel
    if data.room != None:
        student.room = data.room

    db.commit()
    db.refresh(student)

    return student
# ------------------------------------------------------------------