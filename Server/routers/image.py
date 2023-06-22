
from fastapi import APIRouter , status , HTTPException , Depends , UploadFile , File
from Server.database import getdb
from sqlalchemy.orm.session import Session
import secrets

import Server.config as config
import Server.utils as utils
import Server.schemas as schemas
import Server.models as models
from Server.routers.auth import getCurrentUser

imageRouter = APIRouter(tags=["Image"])


# ----------------------------UPLOAD IMAGE (STUDENT)-------------------------
@imageRouter.post("/image/{id}" , status_code=status.HTTP_204_NO_CONTENT)
async def imageUpload(id:int , file:UploadFile = File(...) , student:models.Student = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    if not isinstance(student , models.Student):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Operation not allowed")
    
    complaint = db.query(models.Complaint).filter(models.Complaint.id == id).first()
    if complaint == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Complaint not found")
    
    if complaint.studentId != student.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Not allowed")
    
    if complaint.image!=None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail="Already Uploaded")
    
    url , publicId = utils.uploadImage(file.file)

    imageRow = models.Image(
        complaintId = id,
        name = file.filename,
        publicId = publicId,
        url = url
    )

    db.add(imageRow)
    db.commit()
# ------------------------------------------------------------------


# ----------------------------DELETE IMAGE (STUDENT)-------------------------
@imageRouter.delete("/image/{id}" , status_code=status.HTTP_204_NO_CONTENT)
def imageDelete(id:int , student:models.Student = Depends(getCurrentUser) , db:Session = Depends(getdb)):
    if not isinstance(student , models.Student):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Operation not allowed")
    
    complaint = db.query(models.Complaint).filter(models.Complaint.id == id).first()
    if complaint == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Complaint not found")
    
    if complaint.studentId != student.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail="Not allowed")
    
    if complaint.image == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Image not found")
    
    image = db.query(models.Image).filter(models.Image.complaintId == id).first()

    if utils.deleteImage(image.publicId):
        db.delete(image)
        db.commit()

    else:
        raise HTTPException(status_code=status.HTTP_424_FAILED_DEPENDENCY , detail="Deletion Failed")
# ------------------------------------------------------------------
