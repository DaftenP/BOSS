import torch

# PyTorch 버전 확인
print("PyTorch version:", torch.__version__)

# CUDA 사용 가능 여부 확인
cuda_available = torch.cuda.is_available()
print("CUDA available:", cuda_available)

# CUDA 디바이스 수 확인
if cuda_available:
    num_devices = torch.cuda.device_count()
    print("Number of CUDA devices:", num_devices)

    # 각 디바이스의 이름 출력
    for i in range(num_devices):
        print(f"CUDA Device {i}: {torch.cuda.get_device_name(i)}")

    # 현재 사용 중인 디바이스 인덱스 확인
    current_device = torch.cuda.current_device()
    print("Current CUDA device index:", current_device)
    print("Current CUDA device name:", torch.cuda.get_device_name(current_device))
else:
    print("CUDA is not available. Please check your CUDA installation.")
