import sys
from PyQt5.QtWidgets import *
from PyQt5.QtGui import QImage, QPixmap
from PyQt5 import uic
import requests
import cv2

# UI파일 연결
form_class = uic.loadUiType("./gui/main.ui")[0]


class MainWindow(QMainWindow, form_class):
    def __init__(self):
        super().__init__()
        self.setupUi(self)
        self.btn_1.clicked.connect(self.btn_clicked)

    def btn_clicked(self):
        print("Button clicked")
        self.textEdit.setText('김싸피')
        self.textEdit_2.setText('SSAFY')
        self.textEdit_3.setText('교육생')
        response = requests.get('https://mybossbucket.s3.ap-northeast-2.amazonaws.com/5fc31d49-egot.jpg')
        self.profileImage.setPixmap(QPixmap.fromImage(QImage.fromData(response.content)))

    def update_cam(self, frames):
        for idx, f in enumerate(frames):
            if f is not None:
                height, width, _ = f.shape
                rgb_frame = cv2.cvtColor(f, cv2.COLOR_BGR2RGB)
                qimg = QImage(rgb_frame.data, width, height, QImage.Format_RGB888)
                if idx == 0:
                    self.cam1.setPixmap(QPixmap.fromImage(qimg))
                elif idx == 1:
                    self.cam2.setPixmap(QPixmap.fromImage(qimg))
