# YOLO v8 학습 코드

### 학습 데이터

[링크](https://universe.roboflow.com/daftenp/camera-lens-detection)

- Dataset split ratio : Train 1131 / Valid 113 / Test 54
- Preprocessing : Auto-Orient / Resize: Stretch to 1280\*1280
- Augmentation : 90° Rotate: Clockwise, Counter-Clockwise, Upside Down

### 하이퍼 파라미터

- epochs=100
- patience=30
- batch=32
- imgsz=416

### 후기 (24-07-22)

- 현재 후면 카메라 렌즈는 제법 잘 탐지 되는 상태.
- 예제 코드에서 별다른 하이퍼 파라미터 튜닝을 수행하지 않았음.
- 데이터 전처리도 고민해볼 것.
