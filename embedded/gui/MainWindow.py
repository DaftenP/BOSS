import asyncio
from PyQt6.QtWidgets import QMainWindow
from PyQt6.QtGui import QImage, QPixmap
from PyQt6.QtCore import QTimer
from PyQt6.QtCore import QThread, pyqtSignal
from PyQt6 import uic
from module.connection import get_member_info, get_member_logs, get_image, post_log
from module.operate_signal import emit_result
import serial
import cv2
import time

# UI파일 연결
form_class = uic.loadUiType("./gui/main.ui")[0]
now = time.time()

class MemberThread(QThread):
    finished = pyqtSignal(dict)

    def __init__(self, nfc_uid):
        super().__init__()
        self.nfc_uid = nfc_uid

    def run(self):
        asyncio.run(self.fetch_data())

    async def fetch_data(self):
        # print(f'cp 2: {time.time() - now: .2f}')
        response = await get_member_info(self.nfc_uid)
        # print(f'cp 3: {time.time() - now: .2f}')
        if response:
            # 시그널을 통해 결과를 전달
            self.finished.emit(response)


class LogThread(QThread):
    finished = pyqtSignal(dict)

    def __init__(self, image1, image2, data):
        super().__init__()
        self.image1 = image1
        self.image2 = image2
        self.data = data

    def run(self):
        asyncio.run(self.fetch_data())

    async def fetch_data(self):
        response = await post_log(self.image1, self.image2, self.data)


class MainWindow(QMainWindow, form_class):
    def __init__(self):
        super().__init__()
        self.thread = None
        self.member_id = 0
        self.video_processor = None
        self.setupUi(self)
        # self.btn_clear.clicked.connect(self.set_default)
        self.serial_ = serial.Serial(port='/dev/ttyTHS0', baudrate=115200, timeout=1)

        # QTimer 설정
        self.timer = QTimer()
        self.timer.setInterval(100)  # 약 100ms마다 호출
        self.timer.timeout.connect(self.read_nfc)

        self.set_default()

    def set_member_info(self, nfc_uid: str) -> None:
        # WorkerThread 인스턴스 생성
        self.thread = MemberThread(nfc_uid)
        self.thread.finished.connect(lambda response: asyncio.run(self.handle_member_info(response)))  # 비동기 호출
        # print(f'cp 1 : {time.time() - now: .2f}')
        self.thread.start()  # 스레드 시작

    async def handle_member_info(self, response):
        # 사용자 정보 출력
        self.member_id = response['memberId']
        self.member_name.setText(response['name'])
        self.member_department.setText(response['department']['departmentName'])
        self.member_position.setText(response['position']['positionName'])
        # print(f'cp 4: {time.time() - now: .2f}')
        # 프로필 이미지 조회
        if response['profileImage']:
            image = await get_image(response['profileImage'])
            if image:
                self.profile_image.setPixmap(QPixmap.fromImage(QImage.fromData(image)))

        # print(f'cp 5: {time.time() - now: .2f}')
        # 보안 이슈 조회
        issue_logs = await get_member_logs(response['memberId'])
        self.issue_list.clear()
        for log in issue_logs:
            self.issue_list.addItem(f'{log["time"]} : {log["gateNumber"]}번 게이트')
        self.issue_count.setText(str(len(issue_logs)))

        # print(f'cp 6: {time.time() - now: .2f}')
        # 이전 출입 기록 조회
        entering_logs = await get_member_logs(response['memberId'], issue=False)
        last_in_log = entering_logs[-1] if entering_logs else None

        # print(f'cp 7: {time.time() - now: .2f}')
        if last_in_log:
            device_front_image = await get_image(last_in_log['deviceFrontImage'])
            device_back_image = await get_image(last_in_log['deviceBackImage'])
            if device_front_image:
                self.front_image.setPixmap(QPixmap.fromImage(QImage.fromData(device_front_image)))
            if device_back_image:
                self.back_image.setPixmap(QPixmap.fromImage(QImage.fromData(device_back_image)))
            self.label_last_io.setText(last_in_log['time'])

        self.video_processor.start_validation()

    def set_default(self) -> None:
        self.member_id = 0
        self.member_name.setText('')
        self.member_department.setText('')
        self.member_position.setText('')
        self.issue_count.setText('0')
        self.profile_image.setPixmap(QPixmap('./gui/profile.png'))
        self.status_bar.setPixmap(QPixmap('./gui/default.png'))
        self.front_image.setText('')
        self.back_image.setText('')
        self.issue_list.clear()
        self.label_last_io.setText('')
        self.timer.start()

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
            try:
                uid = self.serial_.readline().decode('utf-8').strip()
            except UnicodeDecodeError:
                uid = self.serial_.readline()  # 바이트 데이터로 유지
                # print(f"Received raw data: {uid}")
            if uid:
                self.timer.stop()
                self.set_member_info(uid)
        return None

    def set_status_bar(self, is_pass: bool):
        self.status_bar.setPixmap(QPixmap(f'./gui/{"pass" if is_pass else "fail"}.png'))
        emit_result(17 if is_pass else 18)
        self.start_timer()

    def send_log(self, image1, image2, sticker_count: int, is_pass: bool, lens: int):
        data = {
            'memberId': self.member_id,
            'entering': 0,
            'gateNumber': 1,
            'stickerCount': sticker_count,
            'issue': 0 if is_pass else 1,
            'cameraLens': lens
        }
        # WorkerThread 인스턴스 생성
        self.thread = LogThread(image1, image2, data)
        self.thread.start()  # 스레드 시작

    def start_timer(self):
        self.reset_timer = QTimer(self)
        self.reset_timer.setSingleShot(True)
        self.reset_timer.timeout.connect(self.set_default)
        self.reset_timer.start(5000)
