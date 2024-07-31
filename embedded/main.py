from model.Model import Model
from module import object_detection

if __name__ == '__main__':
    model = Model('./model/best.pt')
    object_detection.run(model, 1280, 720, 3, 1, threshold=0.45)
