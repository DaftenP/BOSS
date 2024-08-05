import serial

def receive_uid_via_uart():
    """
    UART를 통해 NFC UID를 수신하는 함수입니다.

    :param port: 시리얼 포트 경로
    :param baudrate: 통신 속도
    :param timeout: 수신 대기 시간
    :return: 수신된 NFC UID
    """
    # 시리얼 포트 설정
    ser = serial.Serial(port='/dev/ttyTHS0', baudrate=115200, timeout=1)
    
    uid = None
    if ser.in_waiting > 0:
        # UART로부터 데이터 수신
        uid = ser.readline().decode('utf-8').strip()
        if uid:
            print(f"Received NFC UID: {uid}")
        else:
            print("No UID received.")
            
    ser.close()
    return uid

if __name__ == "__main__":
    receive_uid_via_uart()
