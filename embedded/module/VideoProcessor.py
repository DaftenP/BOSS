import cv2
from collections import deque, Counter
from PyQt6.QtCore import QTimer

COLOR_PALETTE = [(220, 220, 0), (255, 0, 0), (255, 255, 255), (0, 0, 220), (0, 220, 0)]
# 0: 'lens_back', 1: 'lens_front', 2: 'phone', 3: 'removed_sticker', 4: 'sticker'
THRESHOLD = {0: 0.5, 1: 0.6, 2: 0.7, 3: 0.55, 4: 0.35}


class VideoProcessor:
    def __init__(self, model: 'Model', window: 'MainWindow', w: int, h: int, rate: int):
        # 카메라 객체 할당
        self.cap1 = cv2.VideoCapture(0)
        self.cap2 = cv2.VideoCapture(2)

        # 카메라 인식 실패 시ㅠ
        if not (self.cap1.isOpened() and self.cap2.isOpened()):
            print("Error: Could not open camera.")
            exit()

        # 해상도 설정
        self.cap1.set(cv2.CAP_PROP_FRAME_WIDTH, w)
        self.cap2.set(cv2.CAP_PROP_FRAME_WIDTH, w)
        self.cap1.set(cv2.CAP_PROP_FRAME_HEIGHT, h)
        self.cap2.set(cv2.CAP_PROP_FRAME_HEIGHT, h)

        # 인식 프레임 레이트
        self.frame_skip = rate
        self.frame_count = 0
        self.detection_frame = -1
        self.correct_cnt = 0
        self.incorrect_cnt = 0
        self.inferences = []
        self.model = model
        self.window = window
        self.width = w
        self.height = h

        # QTimer 설정
        self.timer = QTimer()
        self.timer.setInterval(50)  # 약 50ms마다 호출
        self.timer.timeout.connect(self.process_frames)
        self.timer.start()

    def process_frames(self):
        ret1, frame1 = self.cap1.read()
        if not ret1:
            print("Error: Could not read frame 1.")
            return

        ret2, frame2 = self.cap2.read()
        if not ret2:
            print("Error: Could not read frame 2.")
            return

        self.frame_count += 1
        frame = [frame1, frame2]

        if self.frame_count % self.frame_skip == 0:
            # 입력 conv 레이어 텐서에 맞게 프레임 리사이즈
            resized_frame = [cv2.resize(frame1, (640, 640)), cv2.resize(frame2, (640, 640))]

            results = list(map(self.model.predict, resized_frame))
            self.inferences.clear()
            class_cnt = [Counter(), Counter()]

            for idx, result in enumerate(results):
                for data in result[0].boxes.data.tolist():
                    confidence = float(data[4])
                    class_id = int(data[5])
                    if confidence < THRESHOLD[class_id]:
                        continue
                    x1, y1, x2, y2 = data[:4]
                    x1, x2 = list(map(lambda x: x / 640 * self.width, (x1, x2)))
                    y1, y2 = list(map(lambda x: x / 640 * self.height, (y1, y2)))

                    label = f'{self.model.model.names[class_id]}: {confidence: .2f}'
                    self.inferences.append([idx, x1, y1, x2, y2, confidence, class_id, label])
                    class_cnt[idx][class_id] += 1

            if self.detection_frame != -1:
                if self.detection_frame + 300 > self.frame_count:
                    if class_cnt[0][2] or class_cnt[1][2]:
                        if (class_cnt[0][0] == 0 and class_cnt[1][0] == 0 and
                                class_cnt[0][3] == 0 and class_cnt[1][3] == 0):
                            if class_cnt[0][4] > 0 and class_cnt[1][4] > 0:
                                self.correct_cnt += 1
                        else:
                            self.incorrect_cnt += 1
                else:
                    self.emit_validation(frame[0], frame[1], False)

                if self.correct_cnt > 2:
                    self.emit_validation(frame[0], frame[1], True)
                elif self.incorrect_cnt > 2:
                    self.emit_validation(frame[0], frame[1], False)

        for idx, x1, y1, x2, y2, confidence, class_id, label in self.inferences:
            cv2.rectangle(frame[idx],
                          (int(x1), int(y1)),
                          (int(x2), int(y2)),
                          COLOR_PALETTE[class_id % 5],
                          1)
            cv2.putText(frame[idx],
                        label,
                        (int(x1), int(y1) - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        COLOR_PALETTE[class_id % 5],
                        1)
        self.window.update_cam(frame)

    def release_resources(self):
        self.cap1.release()
        self.cap2.release()
        cv2.destroyAllWindows()

    def start_validation(self):
        self.detection_frame = self.frame_count

    def emit_validation(self, frame1, frame2, is_pass: bool):
        self.detection_frame = -1
        self.correct_cnt = 0
        self.incorrect_cnt = 0
        _, image1 = cv2.imencode('.jpg', frame1)
        _, image2 = cv2.imencode('.jpg', frame2)
        self.window.set_status_bar(is_pass)
        self.window.send_log(image1, image2, 4, is_pass, 0)
