import threading
from time import sleep
from module.nfc import NFCReader
from module.uart import UARTCommunication
from module.ultrasonic_sensor import UltrasonicSensor
from module.sound import SoundPlayer
from module.servo_motor import ServoMotor
from module.led import LED
from module.input_detector import InputDetector

class MainProgram:
    def __init__(self):
        self.nfc_reader = NFCReader()
        self.uart_comm = UARTCommunication()
        self.sound_player = SoundPlayer()
        ServoMotor.setup_gpio()
        self.servo = ServoMotor()
        self.sensor = UltrasonicSensor()
        self.led = LED()
        self.inputdetector = InputDetector()
        self.running = True
        self.last_uid = None
        self.uid_str = None
        self.mod = 0  # uid 인식 전

    def run(self):
        try:
            while self.running:
                try:
                    if self.mod == 0:
                        self.uid_str = self.nfc_reader.read()

                        if self.uid_str is not None and self.uid_str != self.last_uid:
                            print(f"NFC UID: {self.uid_str}")
                            self.uart_comm.send_uid(self.uid_str)
                            self.sound_player.play_check_sound()
                            self.last_uid = self.uid_str  # Update last_uid to the new UID
                            sleep(1)
                            self.mod = 1
                            # self.mod = self.inputdetector(17)

                        elif self.uid_str == self.last_uid:
                            self.sound_player.play_alert_sound()
                            print("이미 NFC 태깅된 카드입니다.")
                            sleep(0.1)

                        else:
                            if self.uid_str is None:
                                print("NFC 태그를 찾을 수 없습니다.")

                    elif self.mod == 1:
                        print("서보 동작")
                        self.servo.move(angle=0)  # 170도 위치로 이동
                        sleep(1)

                        if self.inputdetector.detect_input_pass() == 1: # 스티커 제대로 부착시
                            while True:
                                distance = self.sensor.measure_distance()
                                print(f"측정된 거리: {distance:.2f} cm")
                                # 사람이 이동하면 차단바 내려감
                                if distance < 20:  # 10 cm 이하로 측정되면
                                    print("물체가 가까이 있습니다. 서보를 다시 동작시킵니다.")
                                    self.servo.move(angle=170)  # 0도 위치로 이동
                                    self.led.blink_green(duration=3, interval=0.5)
                                    sleep(1)  # 서보가 이동할 시간을 기다림
                                    break  # 거리 측정을 계속하지 않고 루프를 종료
                                sleep(0.1)  # CPU 사용을 줄이기 위해 잠시 대기
                            self.mod = 0  # 물체가 감지되면 mod를 0으로 설정하여 NFC 읽기로 돌아갑니다.

                        elif self.inputdetector.detect_input_fail() == 1: # 보안 이슈 발생
                            self.led.blink_red(duration=3, interval=0.5)
                            self.servo.move(angle=0)
                            self.sound_player.play_alert_sound()
                            self.sound_player.play_alert_sound()
                            self.mod = 0
                        
                        else:
                            self.mod = 0
                            print("제대로 인식 못함")

                except Exception as e:
                    print(f"Error reading NFC UID: {e}")
        finally:
            self.servo.stop()
            ServoMotor.cleanup_gpio()

    def stop(self):
        self.running = False

def monitor_keyboard(main_program):
    while True:
        user_input = input("Press 'q' to quit: ")
        if user_input.lower() == 'q':
            main_program.stop()
            break  # Exit the loop to end the function

if __name__ == "__main__":
    main_program = MainProgram()

    # Start the main program in a separate thread
    main_thread = threading.Thread(target=main_program.run)
    main_thread.start()

    # Monitor keyboard input in the main thread
    monitor_keyboard(main_program)

    # Wait for the main thread to finish
    main_thread.join()
    print("Program terminated.")
