# pn532 관련 api 다운로드 해야합니다.
# git clone https://github.com/hoanhan101/pn532.git

import serial
import pygame
import time
from pn532 import PN532

# pygame 믹서 초기화
pygame.mixer.init()

# mp3 파일 로드
mp3_file_path = "/home/ssafy/Desktop/nfc/alert.mp3"
pygame.mixer.music.load(mp3_file_path)

def setup_uart(port='/dev/ttyAMA0', baudrate=115200):
    """UART 연결 설정."""
    return serial.Serial(port, baudrate, timeout=1)

def send_uid_via_uart(uid):
    """UART를 통해 UID 전송."""
    try:
        with setup_uart() as ser:
            ser.write(uid.encode())
    except serial.SerialException as e:
        print(f"시리얼 통신 오류: {e}")
    except Exception as e:
        print(f"UART 통신 오류: {e}")

def play_alert_sound():
    """소리가 재생 중이지 않으면 경고음 재생."""
    try:
        if not pygame.mixer.music.get_busy():
            pygame.mixer.music.play()
    except pygame.error as e:
        print(f"소리 재생 오류: {e}")

def process_uid(uid):
    """UID를 처리하여 요구 사항에 맞게 다듬기."""
    if isinstance(uid, list):
        uid = bytes(uid)  # 리스트를 바이트로 변환할 필요가 있는 경우
    
    # UID 바이트를 16진수 문자열로 변환
    uid_str = ''.join(format(byte, '02X') for byte in uid)
    
    # UID 문자열을 요구 사항에 맞게 잘라내기
    if len(uid_str) > 14:
        uid_str = uid_str[10:-4]
    
    return uid_str

def main():
    # PN532 NFC 리더기 초기화
    nfc = PN532()

    # 선택적으로 PN532 장치를 초기화하거나 구성할 수 있습니다
    # 예를 들어, I2C를 사용하는 경우:
    # nfc.SAM_config()

    # NFC UID를 지속적으로 읽기 위한 루프
    last_uid = None  # 마지막 UID를 추적하여 같은 UID를 여러 번 전송하지 않도록 방지
    while True:
        try:
            # NFC UID 읽기
            uid = nfc.read()  # 실제 사용하는 라이브러리에서 제공하는 메소드에 맞게 조정
            
            if uid:
                # UID를 처리하여 다듬기
                uid_str = process_uid(uid)
                
                if uid_str != last_uid:
                    print(f"NFC UID: {uid_str}")
                    send_uid_via_uart(uid_str)
                    play_alert_sound()
                    time.sleep(1)  # 1초 대기
                    #last_uid = uid_str  # 마지막 UID 업데이트
            else:
                print("NFC 태그를 찾을 수 없습니다.")
        
        except Exception as e:
            print(f"NFC UID 읽기 오류: {e}")

if __name__ == "__main__":
    main()
