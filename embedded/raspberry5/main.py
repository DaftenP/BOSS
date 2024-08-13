import queue
import time
import threading
import keyboard  # 추가된 라이브러리
from module.nfc_handler import NFCHandler
from module.servo_handler import ServoHandler
from module.event_loop import EventLoop

def start_event_loop():
    event_queue = queue.Queue()
    nfc_handler = NFCHandler(event_queue)  # NFC 동작
    servo_handler = ServoHandler(event_queue)  # Servo, 초음파, LED 동작
    event_loop = EventLoop(nfc_handler, servo_handler)
    
    # 메인 루프
    while True:
        try:
            event_loop.start()
        except Exception as e: # 에러 발생시 재시작으로 복구하기
            print(f"Error in event loop: {e}")
            event_loop.cleanup()
            time.sleep(2)  # 잠시 대기 후 재시작

if __name__ == "__main__":
    start_event_loop()
