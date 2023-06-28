

from fastapi import FastAPI

from Server.routers.student import userRouter
from Server.routers.auth import authRouter
from Server.routers.password import passRouter
from Server.routers.admin import adminRouter
from Server.routers.complaint import complaintRouter
from Server.routers.upvotes import upvotesRouter
from Server.routers.state import stateRouter
from Server.routers.email import emailRouter
from Server.routers.image import imageRouter


app = FastAPI()
app.include_router(userRouter)
app.include_router(authRouter)
app.include_router(passRouter)
app.include_router(adminRouter)
app.include_router(complaintRouter)
app.include_router(upvotesRouter)
app.include_router(stateRouter)
app.include_router(emailRouter)
app.include_router(imageRouter)

# ----------------------------CORS-------------------------
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
# ------------------------------------------------------------------


# ----------------------------DATABASE-------------------------
from Server.database import engine
import Server.models as models

models.Base.metadata.create_all(engine)
# ------------------------------------------------------------------

