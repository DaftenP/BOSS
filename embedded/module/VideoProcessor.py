import cv2
from collections import deque, Counter
from PyQt6.QtCore import QTimer

COLOR_PALETTE = [(220, 220, 0), (255, 0, 0), (255, 255, 255), (0, 0, 220), (0, 220, 0)]


class VideoProcessor:
    def __init__(self, model: 'Model', window: 'MainWindow', w: int, h: int, rate: int, threshold: float = 0.45):
        # 카메라 객체 할당
        self.cap1 = cv2.VideoCapture(0)
        self.cap2 = cv2.VideoCapture(2)

        # 카메라 인식 실패 시
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
        self.inferences = []
        self.model = model
        self.window = window
        self.threshold = threshold

        # QTimer 설정
        self.timer = QTimer()
        self.timer.timeout.connect(self.process_frames)
        self.timer.start(50)  # 약 50ms마다 호출

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

            for idx, result in enumerate(results):
                for data in result[0].boxes.data.tolist():
                    confidence = float(data[4])
                    if confidence < self.threshold:
                        continue
                    x1, y1, x2, y2 = data[:4]
                    x1, x2 = list(map(lambda x: x / 640 * self.window.width(), (x1, x2)))
                    y1, y2 = list(map(lambda x: x / 640 * self.window.height(), (y1, y2)))

                    class_id = int(data[5])
                    label = f'{self.model.model.names[class_id]}: {confidence: .2f}'
                    self.inferences.append([idx, x1, y1, x2, y2, confidence, class_id, label])

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
