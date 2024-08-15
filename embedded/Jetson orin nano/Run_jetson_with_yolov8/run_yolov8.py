import cv2
import torch

from ultralytics import YOLO


# yolo 모델 로드
model = YOLO('best_7_22.pt')

# CUDA 사용 가능한지 확인
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model.to(device)

# 카메라 설정(예: /dev/video0)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()


# 2프레임마다 한 번씩 처리
frame_skip = 2
frame_count = 0

while True:
    # 프레임 읽기
    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read frame.")
        break
    
    frame_count += 1
    if frame_count % frame_skip != 0:
        continue
    
    # 프레임 크기 조정
    resized_frame = cv2.resize(frame, (640, 640 ))
    
    # 프레임을 BCHW 형식으로 변환
    frame_tensor = torch.from_numpy(resized_frame).permute(2, 0, 1).unsqueeze(0).float().to(device)
    
    # YOLOv8 객체 감시 수행
    results = model(frame_tensor)
    
    # 감지된 객체를 프레임에 표시
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = box.conf[0].item()
            class_id = box.cls[0].item()
            label = f'{model.names[int(class_id)]}: {confidence: .2f}'
            cv2.rectangle(resized_frame, (int(x1), int(y1)) , (int(x2), int(y2)), (0, 255, 0), 2)
            cv2.putText(resized_frame, label, (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 225, 0), 2)
            


    # 결과 프레임 표시
    cv2.imshow('YOLOv8 Detection', resized_frame)
    
    # 'q' 키를 눌러 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    
# 리소스 해제
cap.release()
cv2.destroyAllWindows()