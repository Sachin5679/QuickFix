
from fastapi import APIRouter , status , HTTPException , Depends
from fastapi.responses import RedirectResponse
from Server.database import getdb
from sqlalchemy.orm.session import Session
from Server.routers.auth import getCurrentUser

import Server.config as config
import Server.utils as utils
import Server.schemas as schemas
import Server.models as models

complaintRouter = APIRouter(tags=["Complaint"])


# ----------------------------GET ALL COMMON COMPLAINTS (BOTH)-------------------------
@complaintRouter.get("/complaint/common" , response_model=list[schemas.returnComplaint])
def getAllCommonComplaint(cat:str=None, loc:str=None, state:str=None , ord:str=None , user = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    complaints = db.query(models.Complaint)
    complaints = complaints.filter(models.Complaint.type == "common")
    if cat!=None:
        complaints = complaints.filter(models.Complaint.category == cat)
    if loc!=None:
        complaints = complaints.filter(models.Complaint.location == loc)
    if state!=None:
        complaints = complaints.filter(models.Complaint.state == state)
    if ord!=None:
        complaints = complaints.order_by(models.Complaint.upvotes.desc())
    complaints = complaints.all()
    
    return complaints
# ------------------------------------------------------------------


# ----------------------------GET ALL PERSONAL COMPLAINTS (ADMIN)-------------------------
@complaintRouter.get("/complaint/personal" , response_model=list[schemas.returnComplaint])
def getAllPersonalComplaint(cat:str=None, loc:str=None, state:str=None , ord:str=None , admin:models.Admin = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    if not isinstance(admin , models.Admin):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Not authorized")
    
    complaints = db.query(models.Complaint)
    complaints = complaints.filter(models.Complaint.type == "personal")
    if cat!=None:
        complaints = complaints.filter(models.Complaint.category == cat)
    if loc!=None:
        complaints = complaints.filter(models.Complaint.location == loc)
    if state!=None:
        complaints = complaints.filter(models.Complaint.state == state)
    if ord!=None:
        complaints = complaints.order_by(models.Complaint.upvotes.desc())
    complaints = complaints.all()
    
    return complaints
# ------------------------------------------------------------------



# ----------------------------GET ALL MY COMPLAINTS (STUDENT)-------------------------
@complaintRouter.get("/complaint/my" , response_model=list[schemas.returnComplaint])
def getAllMyComplaint(cat:str=None, loc:str=None, state:str=None , ord:str=None , student:models.Student = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    if not isinstance(student , models.Student):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Not authorized")
        
    complaints = db.query(models.Complaint)
    complaints = complaints.filter(models.Complaint.studentId == student.id)
    if cat!=None:
        complaints = complaints.filter(models.Complaint.category == cat)
    if loc!=None:
        complaints = complaints.filter(models.Complaint.location == loc)
    if state!=None:
        complaints = complaints.filter(models.Complaint.state == state)
    if ord!=None:
        complaints = complaints.order_by(models.Complaint.upvotes.desc())
    complaints = complaints.all()
    
    return complaints
# ------------------------------------------------------------------


# ----------------------------GET SPECIFIC COMPLAINT (BOTH)-------------------------
@complaintRouter.get("/complaint/{id}" , response_model=schemas.returnComplaint)
def getSpecificComplaint(id:int , user = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    complaint = db.query(models.Complaint)
    complaint = complaint.filter(models.Complaint.id == id)
    complaint = complaint.first()

    return complaint
# ------------------------------------------------------------------


# ----------------------------CREATE PERSONAL COMPLAINT (STUDENT)-------------------------
@complaintRouter.post("/complaint/personal")
def createPersonalComplaint(data:schemas.createPersonalComplaint , student:models.Student = Depends(getCurrentUser) , db:Session = Depends(getdb)):

    if not isinstance(student , models.Student):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Not authorized")
    
    if not utils.verifyPassword(data.password , student.password):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY , detail="Invalid Password")

    if data.category == "electrical" and data.object not in schemas.personalElectricalObjects:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY , detail="Category and Object didn't match")
    
    if data.category == "carpentry" and data.object not in schemas.personalCarpentryObjects:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY , detail="Category and Object didn't match")

    check = db.query(models.Complaint)
    check = check.filter(
        (models.Complaint.category == data.category) &
        (models.Complaint.object == data.object) &
        (models.Complaint.location == student.hostel) &
        (models.Complaint.objectId == student.room) &
        (models.Complaint.state != 'closed')
    )
    check = check.first()
    if check != None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail="Complaint for this object is already registered")

    complaint = models.Complaint(
        title = data.title,
        description = data.description,
        state = "new",
        type = "personal",
        location = student.hostel,
        category = data.category,
        object = data.object,
        objectId = student.room,
        studentId = student.id
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return complaint
# ------------------------------------------------------------------


# ----------------------------CREATE COMMON COMPLAINT (STUDENT)-------------------------
@complaintRouter.post("/complaint/common")
def createCommonComplaint(data:schemas.createCommonComplaint , student:models.Student = Depends(getCurrentUser) , db:Session = Depends(getdb)):

    if not isinstance(student , models.Student):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Not authorized")
    
    if not utils.verifyPassword(data.password , student.password):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY , detail="Invalid Password")

    if data.category == "electrical" and data.object not in schemas.commonElectricalObjects:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY , detail="Category and Object didn't match")
    
    if data.category == "carpentry" and data.object not in schemas.commonCarpentryObjects:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY , detail="Category and Object didn't match")

    if data.category == "plumbing" and data.object not in schemas.commonPlumbingObjects:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY , detail="Category and Object didn't match")

    check = db.query(models.Complaint)
    check = check.filter(
        (models.Complaint.category == data.category) &
        (models.Complaint.object == data.object) &
        (models.Complaint.location == data.location) &
        (models.Complaint.objectId == data.objectId) &
        (models.Complaint.state != 'closed')
    )
    check = check.first()
    if check != None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail="Complaint for this object is already registered")


    complaint = models.Complaint(
        title = data.title,
        description = data.description,
        state = "new",
        type = "common",
        location = data.location,
        category = data.category,
        object = data.object,
        objectId = data.objectId,
        studentId = student.id
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return complaint
# ------------------------------------------------------------------


# ----------------------------DELETE MY COMPLAINT (STUDENT)-------------------------
@complaintRouter.delete("/complaint/{id}" , status_code=status.HTTP_204_NO_CONTENT)
def deleteMyComplaint(id:int , student:models.Student = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    if not isinstance(student , models.Student):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Not authorized")

    complaint = db.query(models.Complaint)
    complaint = complaint.filter(models.Complaint.id == id)
    complaint = complaint.first()

    if complaint == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Complaint not found")

    if complaint.studentId != student.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Not allowed")

    if complaint.state != "new":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Complaint is not in new state")
    
    if complaint.image != None :
        if utils.deleteImage(complaint.image.publicId):
            pass
        else:
            print("Image deletion failed")

    db.delete(complaint)
    db.commit()
# ------------------------------------------------------------------




