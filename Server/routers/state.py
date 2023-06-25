
from fastapi import APIRouter , status , HTTPException , Depends
from Server.database import getdb
from sqlalchemy.orm.session import Session
from Server.routers.auth import getCurrentUser

import Server.config as config
import Server.utils as utils
import Server.schemas as schemas
import Server.models as models

stateRouter = APIRouter(tags=["State"])

# ----------------------------MARK DONE MY COMPLAINT (STUDENT)-------------------------
@stateRouter.patch("/done/{id}" , status_code=status.HTTP_204_NO_CONTENT)
def markDoneMyComplaint(id:int , student:models.Student = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    if not isinstance(student , models.Student):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Not authorized")

    complaint = db.query(models.Complaint)
    complaint = complaint.filter(models.Complaint.id == id)
    complaint = complaint.first()

    if complaint == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Complaint not found")

    if complaint.studentId != student.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Not allowed")

    if complaint.state != "accepted":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Complaint is not in accepted state")
    
    complaint.state = "done"
    db.commit()
# ------------------------------------------------------------------


# ----------------------------ACCEPT A COMPLAINT (ADMIN)-------------------------
@stateRouter.patch("/accept/{id}" , status_code=status.HTTP_204_NO_CONTENT)
def acceptAComplaint(id:int , admin:models.Admin = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    if not isinstance(admin , models.Admin):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Not authorized")

    complaint = db.query(models.Complaint)
    complaint = complaint.filter(models.Complaint.id == id)
    complaint = complaint.first()

    if complaint == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Complaint not found")

    if complaint.location != admin.hostel:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Not allowed")

    if complaint.state != "new":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Complaint is not in new state")
    
    complaint.state = "accepted"
    db.commit()
# ------------------------------------------------------------------


# ----------------------------CLOSE A COMPLAINT (ADMIN)-------------------------
@stateRouter.patch("/close/{id}" , status_code=status.HTTP_204_NO_CONTENT)
def closeAComplaint(id:int , admin:models.Admin = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    if not isinstance(admin , models.Admin):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Not authorized")

    complaint = db.query(models.Complaint)
    complaint = complaint.filter(models.Complaint.id == id)
    complaint = complaint.first()

    if complaint == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Complaint not found")

    if complaint.location != admin.hostel:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Not allowed")

    if complaint.state != "done":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Complaint is not in done state")
    
    complaint.state = "closed"
    db.commit()
# ------------------------------------------------------------------


# ----------------------------REJECT A COMPLAINT (ADMIN)-------------------------
@stateRouter.patch("/reject/{id}" , status_code=status.HTTP_204_NO_CONTENT)
def rejectAComplaint(id:int , data:schemas.requestRejectReason , admin:models.Admin = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    if not isinstance(admin , models.Admin):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Not authorized")

    complaint = db.query(models.Complaint)
    complaint = complaint.filter(models.Complaint.id == id)
    complaint = complaint.first()

    if complaint == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Complaint not found")

    if complaint.location != admin.hostel:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Not allowed")

    if complaint.state != "new":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Complaint is not in new state")
    
    rejectedComplaint = models.RejectedComplaint(
        complaintId = id,
        reason = data.reason
    )

    db.add(rejectedComplaint)
    complaint.state = "rejected"
    db.commit()
# ------------------------------------------------------------------

