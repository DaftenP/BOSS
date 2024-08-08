import sys
from PyQt6.QtWidgets import QMainWindow, QApplication, QLabel, QTextEdit, QListWidget, QPushButton  # 변경된 import 경로
from PyQt6.QtGui import QImage, QPixmap
from PyQt6 import uic
from module.connection import get_member_info, get_member_logs, get_image
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
        print("set_member_info")

        # 사용자 정보 조회
        response = get_member_info(self.textEdit_4.toPlainText().strip())
        if response:
            # 사용자 정보 출력
            self.member_name.setText(response['name'])
            self.member_department.setText(response['department']['departmentName'])
            self.member_position.setText(response['position']['positionName'])

            # 프로필 이미지 조회
            if response['profileImage']:
                image = get_image(response['profileImage'])
                if image:
                    self.profile_image.setPixmap(QPixmap.fromImage(QImage.fromData(image)))

            # 보안 이슈 조회
            issue_logs = get_member_logs(response['memberId'])
            for log in issue_logs:
                self.issue_list.addItem(f'{log["time"]} : {log["gateNumber"]}번 게이트')
            self.issue_count.setText(str(len(issue_logs)))

            # 이전 출입 기록 조회
            entering_logs = get_member_logs(response['memberId'], issue=False)
            last_in_log = entering_logs[-1] if entering_logs else None

            if last_in_log:
                device_front_image = get_image(last_in_log['deviceFrontImage'])
                device_back_image = get_image(last_in_log['deviceBackImage'])
                if device_front_image:
                    self.front_image.setPixmap(QPixmap.fromImage(QImage.fromData(device_front_image)))
                if device_back_image:
                    self.back_image.setPixmap(QPixmap.fromImage(QImage.fromData(device_back_image)))

    def set_default(self):
        self.member_name.setText('')
        self.member_department.setText('')
        self.member_position.setText('')
        self.issue_count.setText('0')
        self.profile_image.setPixmap(QPixmap('./gui/profile.png'))
        self.front_image.setText('')
        self.back_image.setText('')
        self.issue_list.clear()

    def update_cam(self, frames):
        for idx, f in enumerate(frames):
            if f is not None and f.size > 0:
                height, width, _ = f.shape
                rgb_frame = cv2.cvtColor(f, cv2.COLOR_BGR2RGB)
                qimg = QImage(rgb_frame.data, width, height, QImage.Format.Format_RGB888)
                if idx == 0:
                    self.cam1.setPixmap(QPixmap.fromImage(qimg))
                elif idx == 1:
                    self.cam2.setPixmap(QPixmap.fromImage(qimg))
