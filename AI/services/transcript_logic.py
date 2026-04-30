import json
import os
from groq import AsyncGroq
from utils.prompts import SYSTEM_PROMPT_TRANSCRIPT
from dotenv import load_dotenv

# Memuat variabel dari file .env
load_dotenv()

# Inisialisasi client Groq
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

async def analyze_transcript_with_ai(raw_text: str) -> dict:
    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_TRANSCRIPT},
                {"role": "user", "content": f"Ini teks mentah transkripnya:\n\n{raw_text}"}
            ],
            temperature=0.1, 
            response_format={"type": "json_object"} 
        )
        
        ai_result = response.choices[0].message.content
        parsed_json = json.loads(ai_result)
        
        return parsed_json
        
    except Exception as e:
        raise Exception(f"Gagal memproses dengan AI Groq: {str(e)}")