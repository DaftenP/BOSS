import asyncio
from PyQt6.QtWidgets import QMainWindow
from PyQt6.QtGui import QImage, QPixmap
from PyQt6.QtCore import QTimer
from PyQt6.QtCore import QThread, pyqtSignal
from PyQt6 import uic
from module.connection import get_member_info, get_member_logs, get_image
from module.operate_signal import emit_result
import serial
import cv2

# UI파일 연결
form_class = uic.loadUiType("./gui/main.ui")[0]


class WorkerThread(QThread):
    finished = pyqtSignal(dict)

    def __init__(self, nfc_uid):
        super().__init__()
        self.nfc_uid = nfc_uid

    def run(self):
        asyncio.run(self.fetch_data())

    async def fetch_data(self):
        response = await get_member_info(self.nfc_uid)
        if response:
            # 시그널을 통해 결과를 전달
            self.finished.emit(response)


class MainWindow(QMainWindow, form_class):
    def __init__(self):
        super().__init__()
        self.setupUi(self)
        self.btn_1.clicked.connect(self.set_member_info)
        self.btn_clear.clicked.connect(self.set_default)
        self.set_default()
        self.serial_ = serial.Serial(port='/dev/ttyTHS0', baudrate=115200, timeout=1)

        # QTimer 설정
        self.timer = QTimer()
        self.timer.timeout.connect(self.read_nfc)
        self.timer.start(100)  # 약 100ms마다 호출

    def set_member_info(self, nfc_uid: str) -> None:
        # WorkerThread 인스턴스 생성
        self.thread = WorkerThread(nfc_uid)
        self.thread.finished.connect(lambda response: asyncio.run(self.handle_member_info(response)))  # 비동기 호출
        self.thread.start()  # 스레드 시작

    async def handle_member_info(self, response):
        # 사용자 정보 출력
        self.member_name.setText(response['name'])
        self.member_department.setText(response['department']['departmentName'])
        self.member_position.setText(response['position']['positionName'])

        # 프로필 이미지 조회
        if response['profileImage']:
            image = await get_image(response['profileImage'])  # await 추가
            if image:
                self.profile_image.setPixmap(QPixmap.fromImage(QImage.fromData(image)))

        # 보안 이슈 조회
        issue_logs = await get_member_logs(response['memberId'])  # await 추가
        for log in issue_logs:
            self.issue_list.addItem(f'{log["time"]} : {log["gateNumber"]}번 게이트')
        self.issue_count.setText(str(len(issue_logs)))

        # 이전 출입 기록 조회
        entering_logs = await get_member_logs(response['memberId'], issue=False)  # await 추가
        last_in_log = entering_logs[-1] if entering_logs else None

        if last_in_log:
            device_front_image = await get_image(last_in_log['deviceFrontImage'])  # await 추가
            device_back_image = await get_image(last_in_log['deviceBackImage'])  # await 추가
            if device_front_image:
                self.front_image.setPixmap(QPixmap.fromImage(QImage.fromData(device_front_image)))
            if device_back_image:
                self.back_image.setPixmap(QPixmap.fromImage(QImage.fromData(device_back_image)))

    def set_default(self) -> None:
        self.member_name.setText('')
        self.member_department.setText('')
        self.member_position.setText('')
        self.issue_count.setText('0')
        self.profile_image.setPixmap(QPixmap('./gui/profile.png'))
        self.front_image.setText('')
        self.back_image.setText('')
        self.status_bar.setText('default')
        self.issue_list.clear()

    def update_cam(self, frames) -> None:
        for idx, f in enumerate(frames):
            if f is not None and f.size > 0:
                height, width, _ = f.shape
                rgb_frame = cv2.cvtColor(f, cv2.COLOR_BGR2RGB)
                qimg = QImage(rgb_frame.data, width, height, QImage.Format.Format_RGB888)
                if idx == 0:
                    self.cam1.setPixmap(QPixmap.fromImage(qimg))
                elif idx == 1:
                    self.cam2.setPixmap(QPixmap.fromImage(qimg))

    def read_nfc(self) -> None:
        if self.serial_.in_waiting > 0:
            # UART로부터 데이터 수신
            uid = self.serial_.readline().decode('utf-8').strip()
            if uid:
                self.set_member_info(uid)
        return None

    def set_status_bar(self, is_pass: bool):
        self.status_bar.setText(is_pass)
        emit_result(17 if is_pass else 18)
