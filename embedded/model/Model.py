from ultralytics import YOLO
import torch
import logging

# 로깅 레벨을 설정하여 출력 억제
logging.getLogger('ultralytics').setLevel(logging.WARNING)

class Model:
    def __init__(self, path: str) -> None:
        self.model = YOLO(path)
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print(f'YOLO v8 initialized. device : {self.device}')
        self.model.to(self.device)

    def predict(self, img) -> list:
        frame_tensor = torch.from_numpy(img).permute(2, 0, 1).unsqueeze(0).float().to(self.device) / 255.0
        return self.model(frame_tensor)
