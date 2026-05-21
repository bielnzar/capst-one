# routers/planner_router.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.planner_logic import generate_blueprint_plans

router = APIRouter()

# Request model menerima array mata kuliah hasil ekstraksi Academic Mapper sebelumnya
class PlannerInputRequest(BaseModel):
    extracted_courses: list

@router.post("/generate")
async def api_generate_semester_plan(payload: PlannerInputRequest):
    try:
        if not payload.extracted_courses:
            raise HTTPException(status_code=400, detail="Data mata kuliah historis kosong.")
            
        result = generate_blueprint_plans(payload.extracted_courses)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error di Planner Engine: {str(e)}")