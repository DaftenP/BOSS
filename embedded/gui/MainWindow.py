import sys
from PyQt5.QtWidgets import *
from PyQt5.QtGui import QImage, QPixmap
from PyQt5 import uic
from embedded.module.connection import get_member_info, get_member_logs
import requests
import cv2

# UI파일 연결
form_class = uic.loadUiType("./gui/main.ui")[0]


class MainWindow(QMainWindow, form_class):
    def __init__(self):
        super().__init__()
        self.setupUi(self)
        self.btn_1.clicked.connect(self.set_member_info)
        self.btn_clear.clicked.connect(self.set_default)
        self.set_default()

    def set_member_info(self):
        print("Button clicked")

        response = get_member_info(self.textEdit_4.toPlainText().strip())
        if response:
            self.member_name.setText(response['name'])
            self.member_department.setText(response['department']['departmentName'])
            self.member_position.setText(response['position']['positionName'])
            if response['profileImage']:
                image = requests.get(response['profileImage'])
                self.profile_image.setPixmap(QPixmap.fromImage(QImage.fromData(image.content)))
            logs = get_member_logs(response['memberId'])
            for log in logs:
                self.issue_list.addItem(f'{log["time"]} : {log["gateNumber"]}번 게이트')
            self.issue_count.setText(str(len(logs)))

    def set_default(self):
        self.member_name.setText('')
        self.member_department.setText('')
        self.member_position.setText('')
        self.issue_count.setText('0')
        self.profile_image.setPixmap(QPixmap('./gui/profile.png'))
        self.issue_list.clear()

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
