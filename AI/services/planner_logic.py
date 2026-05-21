# services/planner_logic.py
from utils.curriculum_data import MASTER_KURIKULUM

def generate_blueprint_plans(extracted_courses: list) -> dict:
    """
    Fungsi untuk memilah sisa mata kuliah wajib dan pilihan berdasarkan data historis transkrip,
    lalu mendistribusikannya ke dalam skenario Plan A, B, dan C sesuai aturan Tabel 12.
    """
    # 1. Normalisasi data mata kuliah yang sudah diambil/lulus
    taken_codes = {str(c.get("kode", "")).upper().strip() for c in extracted_courses}
    
    # Cek apakah user sudah mengambil salah satu mata kuliah Agama
    has_taken_religion = any(
        code in taken_codes for code in ["UG234905", "UG234904", "UG234901", "UG234903", "UG234906", "UG234902"]
    )
    
    total_sks_completed = 0
    remaining_wajib = []
    available_pilihan = []
    
    # Hitung SKS lulus dari mata kuliah kurikulum resmi
    for mk in MASTER_KURIKULUM:
        kode_mk = mk["kode"].upper()
        
        if kode_mk in taken_codes:
            total_sks_completed += mk["sks"]
            continue
            
        # Aturan Khusus Agama: Jika belum ambil, rekomendasikan Islam Studies (UG234901) sebagai contoh perwakilan wajib
        if mk["tipe"] == "Agama":
            if not has_taken_religion and kode_mk == "UG234901":
                remaining_wajib.append(mk)
            continue
            
        if mk["tipe"] == "Wajib":
            remaining_wajib.append(mk)
        elif mk["tipe"] == "Pilihan":
            available_pilihan.append(mk)

    # Validasi Prasyarat minimal 60 SKS seperti di UI Andre
    if total_sks_completed < 60:
        return {
            "status": "error",
            "message": f"SKS belum mencukupi prasyarat analisis. Total SKS Anda baru: {total_sks_completed} SKS (Minimal 60 SKS)."
        }

    # 2. LOGIKA DISTRIBUSI BLUEPRINT PLAN
    # Mengelompokkan sisa mata kuliah wajib ke dalam penempatan semester depan yang realistis
    
    # Skenario SKS Target Per Semester Berdasarkan Matriks Tabel 12
    # Plan A (Akselerasi)
    plan_a_schedule = [
        {"periode": "Semester 6", "max_sks": 24, "fokus": "Maksimalkan SKS Teori & Pilihan Karir", "courses": []},
        {"periode": "Semester 7", "max_sks": 24, "fokus": "Capstone Project + Sisa MKWK", "courses": []},
        {"periode": "Semester 7.5", "max_sks": 6, "fokus": "Sidang Tugas Akhir (Yudisium Cepat)", "courses": []}
    ]
    
    # Plan B (Ideal Kurikulum)
    plan_b_schedule = [
        {"periode": "Semester 6", "max_sks": 19, "fokus": "Beban Kuliah Ideal Kurikulum DTI", "courses": []},
        {"periode": "Semester 7", "max_sks": 21, "fokus": "Manajemen Proyek & Pemantapan Teori", "courses": []},
        {"periode": "Semester 8", "max_sks": 9, "fokus": "Fokus Penuh Eksekusi Tugas Akhir", "courses": []}
    ]
    
    # Plan C (Konversi MBKM/MSIB)
    plan_c_schedule = [
        {"periode": "Semester 6", "max_sks": 19, "fokus": "Selesaikan Teori Core sebelum Magang", "courses": []},
        {"periode": "Semester 7", "max_sks": 20, "fokus": "Full Magang MSIB Industri (Konversi MBKM)", "courses": []},
        {"periode": "Semester 8", "max_sks": 9, "fokus": "Tugas Akhir Berbasis Studi Kasus Magang", "courses": []}
    ]

    # Distribusi matkul wajib yang tersisa ke jadwal (Simulasi sederhana distribusi berurutan)
    for i, mk in enumerate(remaining_wajib):
        # Plan A
        plan_a_schedule[0 if i < 5 else 1]["courses"].append(mk)
        # Plan B
        plan_b_schedule[0 if i < 4 else (1 if i < 8 else 2)]["courses"].append(mk)
        # Plan C
        if mk["nama"] == "Final Project":
            plan_c_schedule[2]["courses"].append(mk)
        else:
            plan_c_schedule[0 if i < 5 else 1]["courses"].append(mk)

    return {
        "status": "success",
        "metadata": {
            "sks_completed": total_sks_completed,
            "target_total_sks": 144,
            "sks_needed": max(0, 144 - total_sks_completed)
        },
        "plans": {
            "fast": {
                "title": "Plan A — Lulus 3.5 Tahun",
                "desc": "Ambil maks SKS tiap semester, selesaikan TA di sem 7.",
                "schedule": plan_a_schedule
            },
            "balanced": {
                "title": "Plan B — Optimalkan SKS + Karir",
                "desc": "Mix SKS optimal, fokus skill industri dan magang.",
                "schedule": plan_b_schedule
            },
            "experience": {
                "title": "Plan C — Fokus Experience",
                "desc": "Selesaikan MK wajib, magang penuh 4–6 bulan.",
                "schedule": plan_c_schedule
            }
        },
        "pool_pilihan_tersedia": available_pilihan[:6] # Berikan rekomendasi mata kuliah pilihan teratas
    }