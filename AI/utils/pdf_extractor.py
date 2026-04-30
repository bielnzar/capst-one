import pdfplumber
import io
import re

def mask_sensitive_data(text: str) -> str:
    # 1. Sensor NRP
    text = re.sub(r'\b\d{10}\b', '[NRP_DISEMBUNYIKAN]', text)
    
    # 2. Sensor Nama
    text = re.sub(r'(Nama / Name\s*:\s*)([^\n]+)', r'\1[NAMA_DISEMBUNYIKAN]', text)
    
    # 3. Sensor TTL
    text = re.sub(r'(Place, Date of Birth\s*)([^\n]+)', r'\1[TTL_DISEMBUNYIKAN]', text)
    
    return text

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text_content = []
    
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text(layout=True) 
            if page_text:
                text_content.append(page_text)

    full_text = "\n".join(text_content)

    safe_text = mask_sensitive_data(full_text)
    
    return safe_text