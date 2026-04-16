import os
import cv2
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from app.services.detector import DamageDetector
from app.utils.assessment import calculate_dsi

# 1️ Create app FIRST
app = FastAPI(title="AI Vehicle Assessment Backend")

# 2️ Mount static files AFTER app is created
app.mount("/static", StaticFiles(directory="static"), name="static")

# 3️ Initialize detector
detector = DamageDetector()

# Uploads folder
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 4️ Serve frontend at root (replaces old root endpoint)
@app.get("/")
async def serve_frontend():
    return FileResponse("static/index.html")

@app.post("/assess-damage/")
async def assess_damage(file: UploadFile = File(...)):
    # 1. Save Original File
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # 2. AI Inference (Detections + Processed Image Path)
    raw_detections, processed_img_path = detector.analyze_vehicle(file_path)
    
    # 3. Intelligent Scoring (DSI)
    img = cv2.imread(file_path)
    # Ensure img was loaded correctly
    if img is not None:
        dsi_score = calculate_dsi(raw_detections, img.shape)
    else:
        dsi_score = 0
    
    # 4. Triage Logic 
    damage_type = "COSMETIC" if dsi_score < 40 else "STRUCTURAL/FUNCTIONAL"

    return {
        "inspection_summary": {
            "dsi_score": dsi_score,
            "overall_severity": "High" if dsi_score > 60 else "Moderate",
            "triage_category": damage_type
        },
        "processed_image_url": processed_img_path,
        "findings": raw_detections
    }

# Extra: Direct image dekhne ke liye endpoint
@app.get("/view-result/{filename}")
async def get_result_image(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}
if __name__ == "__main__":
    import uvicorn
    print(" Docs available at: http://localhost:8000/docs")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)