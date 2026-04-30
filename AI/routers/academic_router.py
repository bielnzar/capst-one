from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.pdf_extractor import extract_text_from_pdf
from services.transcript_logic import analyze_transcript_with_ai

router = APIRouter()

@router.post("/upload-transcript")
async def process_transcript(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Format file harus PDF")
    
    file_bytes = await file.read()
    
    try:
        safe_raw_text = extract_text_from_pdf(file_bytes)
        
        ai_analysis = await analyze_transcript_with_ai(safe_raw_text)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan: {str(e)}")

    return {
        "filename": file.filename,
        "status": "success",
        "data": ai_analysis
    }