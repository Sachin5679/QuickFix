
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column , Integer , String , Boolean , DateTime, CheckConstraint , ForeignKey , PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


# ----------------------------ADMIN MODEL-------------------------
class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer , primary_key=True)
    name = Column(String , nullable=False)
    email = Column(String , nullable=False , unique=True)
    hostel = Column(String , nullable=False)
    password = Column(String , nullable= False)
    created = Column(DateTime , default=datetime.now)

    __table_args__ = (
        CheckConstraint(email.like(r"%iiitm.ac.in") , name="check_email"),
        CheckConstraint(hostel.in_(["bh1" , "bh2" , "bh3" , "gh"]) , name="check_hostel"),
    )
# ------------------------------------------------------------------


# ----------------------------STUDENT MODEL-------------------------
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer , primary_key=True)
    name = Column(String , nullable=False)
    email = Column(String , nullable=False , unique=True)
    verified = Column(Boolean , default=False)
    hostel = Column(String , nullable=False)
    room = Column(String , nullable=False)
    password = Column(String , nullable= False)
    created = Column(DateTime , default=datetime.now)
    complaints = relationship("Complaint" , back_populates="student" , cascade="all, delete")
    
    __table_args__ = (
        CheckConstraint(email.like(r"%iiitm.ac.in")),
        CheckConstraint(hostel.in_(["bh1", "bh2", "bh3", "gh"]), name="check_hostel"),
    )
# ------------------------------------------------------------------


# ----------------------------EMAIL VERIFICATION MODEL-------------------------
class EmailVerify(Base):
    __tablename__ = "email_verify"

    studentId = Column(Integer , ForeignKey("students.id" , ondelete="CASCADE") , primary_key=True)
    secret = Column(String , nullable=False)

# ------------------------------------------------------------------


# ----------------------------COMPLAINT MODEL-------------------------
class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer , primary_key=True)
    title = Column(String , nullable=False)
    description = Column(String , nullable=False)
    state = Column(String , nullable=False)
    type = Column(String , nullable=False)
    location = Column(String , nullable=False)
    category = Column(String , nullable=False)
    object = Column(String , nullable=False)
    objectId = Column(String)
    studentId = Column(Integer , ForeignKey("students.id" , ondelete="CASCADE"))
    student = relationship("Student" , back_populates="complaints")
    rejectReason = relationship("RejectedComplaint", uselist=False, back_populates="complaint" , cascade="all, delete")
    whoUpvoted = relationship("Upvotes" , back_populates="complaint" , cascade="all, delete")
    image = relationship("Image" , uselist=False , back_populates="complaint")
    
    __table_args__ = (
        CheckConstraint(category.in_(["electrical" , "carpentry" , "plumbing"]) , name="check_category"),
        CheckConstraint(location.in_(["bh1" , "bh2" , "bh3" , "gh"]) , name="check_location"),
        CheckConstraint(state.in_(["new" , "accepted" , "rejected" , "done" , "closed"]) , name="check_state"),
        CheckConstraint(type.in_(["personal" , "common"]) , name="check_type"),
        CheckConstraint(object.in_([
            "table",
            "chair",
            "bed",
            "door",
            "cupboard",
            "window",
            "curtain hanger",
            "tubelight",
            "seconday light",
            "switch board",
            "fan",
            "fan regulator",
            "water cooler",
            "toilet seat",
            "flush",
            "tap",
            "bathroom door",
            "urinal",
            "geaser",
            "shower",
            "basin",
            "other"
        ]) , name="check_object")
    )
# ------------------------------------------------------------------


# ----------------------------REJECTED COMPLAINTS MODEL-------------------------
class RejectedComplaint(Base):
    __tablename__ = "rejected_complaint"

    complaintId = Column(Integer , ForeignKey("complaints.id" , ondelete="CASCADE") , nullable=False , primary_key=True)
    reason = Column(String , nullable=False)
    complaint = relationship("Complaint", back_populates="rejectReason")
# ------------------------------------------------------------------


# ----------------------------UPVOTES MODEL-------------------------
class Upvotes(Base):
    __tablename__ = "upvotes"

    studentId = Column(Integer , ForeignKey("students.id" , ondelete="CASCADE"))
    complaintId = Column(Integer , ForeignKey("complaints.id" , ondelete="CASCADE"))
    complaint = relationship("Complaint" , uselist=False , back_populates="whoUpvoted")

    __table_args__ = (
        PrimaryKeyConstraint("studentId" , "complaintId"),
    )
# ------------------------------------------------------------------


# ----------------------------IMAGE MODEL-------------------------
class Image(Base):
    __tablename__ = "images"

    complaintId = Column(Integer , ForeignKey("complaints.id" , ondelete="CASCADE"), primary_key=True)
    name = Column(String , nullable=False)
    url = Column(String , nullable=False)
    publicId = Column(String , nullable=False)
    complaint = relationship("Complaint" , uselist=False , back_populates="image")
# ------------------------------------------------------------------


# ----------------------------STUDENT TOKEN MODEL-------------------------
class StudentToken(Base):
    __tablename__ = "student_tokens"

    studentId = Column(Integer , ForeignKey("students.id" , ondelete="CASCADE"))
    token = Column(String , nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint("studentId" , "token"),
    )
# ------------------------------------------------------------------


# ----------------------------ADMIN TOKEN MODEL-------------------------
class AdminToken(Base):
    __tablename__ = "admin_tokens"

    adminId = Column(Integer , ForeignKey("admins.id" , ondelete="CASCADE"))
    token = Column(String , nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint("adminId" , "token"),
    )
# ------------------------------------------------------------------


# ----------------------------STUDENT OTP MODEL-------------------------
class StudentOTP(Base):
    __tablename__ = "student_otps"

    studentEmail = Column(String , ForeignKey("students.email" , ondelete="CASCADE") , primary_key=True)
    otp = Column(String , nullable=False)
    created = Column(DateTime , default=datetime.now)
# ------------------------------------------------------------------


# ----------------------------ADMIN OTP MODEL-------------------------
class AdminOTP(Base):
    __tablename__ = "admin_otps"

    adminEmail = Column(String , ForeignKey("admins.email" , ondelete="CASCADE") , primary_key=True)
    otp = Column(String , nullable=False)
    created = Column(DateTime , default=datetime.now)
# ------------------------------------------------------------------