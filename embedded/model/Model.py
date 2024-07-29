from ultralytics import YOLO
import torch


class Model:
    def __init__(self, name: str):
        self.model = YOLO(name)
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print(f'YOLO v8 initialized. device : {self.device}')
        self.model.to(self.device)
