import os
from ultralytics import YOLO
import torch
import torch
from ultralytics.nn.tasks import DetectionModel
torch.serialization.add_safe_globals([DetectionModel])

class DamageDetector:
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, "models", "best.pt")
        print(f"Loading model from: {model_path}")
        self.model = YOLO(model_path)

    def analyze_vehicle(self, file_path):
        results = self.model(file_path)
        
        base, ext = os.path.splitext(file_path)
        output_path = f"{base}_detected{ext}"
        results[0].save(filename=output_path)
        
        detections = []
        for r in results:
            for box in r.boxes:
                detections.append({
                    "class": self.model.names[int(box.cls)],
                    "confidence": round(float(box.conf), 2),
                    "box": box.xyxy[0].tolist()
                })
        
        return detections, output_path
