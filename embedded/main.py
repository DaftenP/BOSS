import cv2
import torch
from model.Model import Model

THRESHOLD = 0.45
COLOR_PALETTE = [(220, 220, 0), (255, 0, 0), (255, 255, 255), (0, 0, 220), (0, 220, 0)]

if __name__ == '__main__':
    model = Model('./model/best.pt')

    # 카메라 객체 할당
    cap1 = cv2.VideoCapture(1)

    # 카메라 인식 실패 시
    if not cap1.isOpened():
        print("Error: Could not open camera.")
        exit()

    # 해상도 설정: 720p (1280x720)
    cap1.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap1.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    # 인식 프레임 레이트
    frame_skip = 3
    frame_count = 0

    # 객체 인식
    while True:
        ret, frame = cap1.read()
        if not ret:
            print("Error: Could not read frame.")
            break

        frame_count += 1
        if frame_count % frame_skip:
            continue

        rotated_frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)

        resized_frame = cv2.resize(rotated_frame, (640, 640))

        frame_tensor = torch.from_numpy(resized_frame).permute(2, 0, 1).unsqueeze(0).float().to(model.device) / 255.0

        results = model.model(frame_tensor)

        for result in results:
            for box in result.boxes:
                # 좌상단, 우하단 좌표값 언패킹
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                # 좌표값 720p로 리스케일
                x1, x2 = list(map(lambda x: x / 640 * 720, (x1, x2)))
                y1, y2 = list(map(lambda x: x / 640 * 1280, (y1, y2)))
                # sigmoid 추정 확률(객체 신뢰도)
                confidence = box.conf[0].item()
                # 추정 확률이 Threshold 보다 낮은 경우 생략
                if confidence < THRESHOLD:
                    continue

                # 클래스 id (0: sticker, 1: removed_sticker, 2: phone, 3: lens_back, 4: lens_front)
                class_id = box.cls[0].item()
                label = f'{model.model.names[int(class_id)]}: {confidence: .2f}'
                cv2.rectangle(rotated_frame,
                              (int(x1), int(y1)),
                              (int(x2), int(y2)),
                              COLOR_PALETTE[int(class_id) % 5],
                              1)
                cv2.putText(rotated_frame,
                            label,
                            (int(x1), int(y1) - 10),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.5,
                            COLOR_PALETTE[int(class_id) % 5],
                            2)

        cv2.imshow('YOLOv8 Detection', rotated_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # 리소스 해제
    cap1.release()
    cv2.destroyAllWindows()
