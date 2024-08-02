from model.Model import Model
from module import object_detection
import threading

if __name__ == '__main__':
    model = Model('./model/best.pt')
    object_detection.run(model, 854, 640, 5, threshold=0.45)
    # model1 = Model('./model/best.pt')
    # model2 = Model('./model/best.pt')
    # thread1 = threading.Thread(target=object_detection.run, args=(model1, 854, 480, 5, 0,))
    # thread2 = threading.Thread(target=object_detection.run, args=(model2, 854, 480, 5, 2,))
    #
    # thread1.start()
    # thread2.start()

