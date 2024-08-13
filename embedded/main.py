from model.Model import Model
from module.VideoProcessor import VideoProcessor
from PyQt6.QtWidgets import *
from gui.MainWindow import MainWindow
import sys
import threading

if __name__ == '__main__':
    model = Model('./model/best_s.pt')

    # QApplication : 프로그램을 실행시켜주는 클래스
    app = QApplication(sys.argv)

    # WindowClass의 인스턴스 생성
    myWindow = MainWindow()

    # 프로그램 화면을 보여주는 코드
    myWindow.show()

    # 객체 탐지

    video_processor = VideoProcessor(model, myWindow, 640, 360, 5)
    myWindow.video_processor = video_processor

    # 프로그램을 이벤트루프로 진입시키는(프로그램을 작동시키는) 코드
    app.exec()
