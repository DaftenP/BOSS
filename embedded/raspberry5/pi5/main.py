from time import sleep
from nfc import NFCReader
from uart import UARTCommunication
from ultrasonic_sensor import UltrasonicSensor
from sound import SoundPlayer
from servo_motor import ServoMotor
from led import LED

def main():
    nfc_reader = NFCReader()
    uart_comm = UARTCommunication()
    sound_player = SoundPlayer()
    ServoMotor.setup_gpio()
    servo = ServoMotor()
    sensor = UltrasonicSensor()
    led = LED()
    
    last_uid = None
    uid_str = None
    mod = 0 # uid 인식 전

    # ServoMotor.cleanup_gpio()
    
    try:
        while True:
            try:
                if mod == 0:
                    uid_str = nfc_reader.read()
                    
                    if uid_str is not None and uid_str != last_uid:
                        print(f"NFC UID: {uid_str}")
                        uart_comm.send_uid(uid_str)
                        sound_player.play_check_sound()
                        last_uid = uid_str    # Update last_uid to the new UID
                        mod = 1

                    elif uid_str == last_uid:
                        sound_player.play_alert_sound()
                        print("이미 NFC 태깅된 카드입니다.")
                        sleep(1) 

                    else:
                        if uid_str is None:
                            print("NFC 태그를 찾을 수 없습니다.")
                
                elif mod == 1:
                    print("서보 동작")
                    # servo.move(angle=0)  # 0도 위치로 이동
                    # sleep(1)
                    servo.move(angle=170)  # 170도 위치로 이동
                    sleep(1)

                    # 사람이 이동하면 차단바 내려감
                    # 거리 측정 후 서보 동작  
                    while True:
                        distance = sensor.measure_distance()
                        print(f"측정된 거리: {distance:.2f} cm")
                        if distance < 20:  # 10 cm 이하로 측정되면
                            print("물체가 가까이 있습니다. 서보를 다시 동작시킵니다.")
                            servo.move(angle=0)  # 0도 위치로 이동
                            led.blink(duration=5, interval=0.5)
                            sleep(1)  # 서보가 이동할 시간을 기다림
                            break  # 거리 측정을 계속하지 않고 루프를 종료
                        sleep(0.1)  # CPU 사용을 줄이기 위해 잠시 대기
                    mod = 0  # 물체가 감지되면 mod를 0으로 설정하여 NFC 읽기로 돌아갑니다.

            except Exception as e:
                print(f"Error reading NFC UID: {e}")
    finally:
        servo.stop()
        ServoMotor.cleanup_gpio()

if __name__ == "__main__":
    main()
