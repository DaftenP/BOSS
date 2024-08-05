import cv2
from collections import deque, Counter

COLOR_PALETTE = [(220, 220, 0), (255, 0, 0), (255, 255, 255), (0, 0, 220), (0, 220, 0)]


def run(model: 'Model', w: int, h: int, rate: int, threshold: float = 0.45) -> None:
    # 카메라 객체 할당
    cap1 = cv2.VideoCapture(0)
    cap2 = cv2.VideoCapture(2)

    # 카메라 인식 실패 시
    if not (cap1.isOpened() and cap2.isOpened()):
        print("Error: Could not open camera.")
        exit()

    # 해상도 설정: (w * h)
    cap1.set(cv2.CAP_PROP_FRAME_WIDTH, w)
    cap2.set(cv2.CAP_PROP_FRAME_WIDTH, w)
    cap1.set(cv2.CAP_PROP_FRAME_HEIGHT, h)
    cap2.set(cv2.CAP_PROP_FRAME_HEIGHT, h)

    # 인식 프레임 레이트
    frame_skip = rate
    frame_count = 0
    inferences = []

    # 객체 인식
    while True:
        ret1, frame1 = cap1.read()
        if not ret1:
            print("Error: Could not read frame 1.")
            break

        ret2, frame2 = cap2.read()
        if not ret2:
            print("Error: Could not read frame 2.")
            break

        frame_count += 1
        frame = [frame1, frame2]
        if not frame_count % frame_skip:
            # 입력 conv 레이어 텐서에 맞게 프레임 리사이즈
            resized_frame = [cv2.resize(frame1, (640, 640)), cv2.resize(frame2, (640, 640))]

            results = list(map(model.predict, resized_frame))
            inferences.clear()

            for idx, result in enumerate(results):
                for data in result[0].boxes.data.tolist():
                    # sigmoid 추정 확률(객체 신뢰도)
                    confidence = float(data[4])
                    # 추정 확률이 Threshold 보다 낮은 경우 생략
                    if confidence < threshold:
                        continue
                    # 좌상단, 우하단 좌표값 언패킹
                    x1, y1, x2, y2 = data[:4]
                    # 좌표값 720p로 리스케일
                    x1, x2 = list(map(lambda x: x / 640 * w, (x1, x2)))
                    y1, y2 = list(map(lambda x: x / 640 * h, (y1, y2)))

                    # 클래스 id (0: sticker, 1: removed_sticker, 2: phone, 3: lens_back, 4: lens_front)
                    class_id = int(data[5])
                    label = f'{model.model.names[class_id]}: {confidence: .2f}'
                    inferences.append([idx, x1, y1, x2, y2, confidence, class_id, label])
        for idx, x1, y1, x2, y2, confidence, class_id, label in inferences:
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

        cv2.imshow(f'YOLOv8 Detection {1}', frame[0])
        cv2.imshow(f'YOLOv8 Detection {2}', frame[1])

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # 리소스 해제
    cap1.release()
    cap2.release()

    cv2.destroyAllWindows()


# TODO : 기기 신호 전달 메소드
async def send_signal() -> None:
    pass
