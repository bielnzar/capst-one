from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import academic_router

app = FastAPI(title="SPARK DTI AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(academic_router.router, prefix="/api/academic", tags=["Academic"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "SPARK DTI AI Service is running."}