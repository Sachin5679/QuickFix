
from fastapi import APIRouter , status , HTTPException , Depends
from Server.database import getdb
from sqlalchemy import func
from sqlalchemy.orm.session import Session
from Server.routers.auth import getCurrentUser

import Server.config as config
import Server.utils as utils
import Server.schemas as schemas
import Server.models as models

upvotesRouter = APIRouter(tags=["Upvotes"])


# ----------------------------UPVOTE A COMPLAINT (STUDENT)-------------------------
@upvotesRouter.post("/upvote/{id}" , status_code=status.HTTP_204_NO_CONTENT)
def upvoteAComplaint(id:int , student:models.Student = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    if not isinstance(student , models.Student):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Not authorized")

    complaint = db.query(models.Complaint)
    complaint = complaint.filter(models.Complaint.id == id)
    complaint = complaint.first()

    if complaint == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Complaint not found")

    if complaint.type == "personal":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Cannot upvote personal complaint")
    
    vote = db.query(models.Upvotes)
    vote = vote.filter((models.Upvotes.complaintId==id) & (models.Upvotes.studentId==student.id))
    vote = vote.first()

    if vote != None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail="Already Upvoted")
    
    vote = models.Upvotes(
        studentId = student.id,
        complaintId = id
    )

    db.add(vote)
    db.commit()
# ------------------------------------------------------------------


# ----------------------------REMOVE UPVOTE FROM A COMPLAINT (STUDENT)-------------------------
@upvotesRouter.post("/remupvote/{id}" , status_code=status.HTTP_204_NO_CONTENT)
def removeUpvoteFromAComplaint(id:int , student:models.Student = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    if not isinstance(student , models.Student):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Not authorized")

    complaint = db.query(models.Complaint)
    complaint = complaint.filter(models.Complaint.id == id)
    complaint = complaint.first()

    if complaint == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Complaint not found")

    if complaint.type == "personal":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Cannot upvote personal complaint")
    
    vote = db.query(models.Upvotes)
    vote = vote.filter((models.Upvotes.complaintId==id) & (models.Upvotes.studentId==student.id))
    vote = vote.first()

    if vote == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Upvote does not exist")
    
    db.delete(vote)
    db.commit()
# ------------------------------------------------------------------


# ----------------------------GET UPVOTE COUNT (BOTH)-------------------------
@upvotesRouter.get("/upvote/{id}")
def getUpvoteCount(id:int , user = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    cnt = db.query(func.count(models.Upvotes.studentId)).filter(models.Upvotes.complaintId == id).scalar()
    return {"Upvotes" : cnt}
# ------------------------------------------------------------------