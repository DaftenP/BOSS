from model.Model import Model
from module import object_detection
from PyQt5.QtWidgets import *
from gui.MainWindow import MainWindow
import sys
import threading

if __name__ == '__main__':
    model = Model('./model/best.pt')

    # QApplication : 프로그램을 실행시켜주는 클래스
    app = QApplication(sys.argv)

    # WindowClass의 인스턴스 생성
    myWindow = MainWindow()

    # 프로그램 화면을 보여주는 코드
    myWindow.show()

    # 객체 탐지
    detection_thread = threading.Thread(target=object_detection.run, args=(model, myWindow, 640, 360, 3, 0.40))

    detection_thread.start()
    # 프로그램을 이벤트루프로 진입시키는(프로그램을 작동시키는) 코드
    app.exec_()
