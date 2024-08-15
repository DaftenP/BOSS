import time
from module.servo_motor import ServoMotor
from module.ultrasonic_sensor import UltrasonicSensor
from module.led import LED
from module.sound import SoundPlayer
from module.input_detector import InputDetector

class ServoHandler:
    def __init__(self, event_queue):
        # GPIO 설정 및 필요한 모듈 초기화
        ServoMotor.setup_gpio()
        self.servo = ServoMotor()  # 서보 모터 제어 객체 생성
        self.sensor = UltrasonicSensor()  # 초음파 센서 객체 생성
        self.led = LED()  # LED 제어 객체 생성
        self.sound_player = SoundPlayer()  # 소리 재생 객체 생성
        self.inputdetector = InputDetector()  # 입력 감지 객체 생성
        self.event_queue = event_queue  # 이벤트 큐

    def process(self):
        try:
            print("서보 동작")
            self.servo.move(angle=160)  # 서보 모터를 지정된 각도로 이동 (통로 개방)
            start_time = time.time()  # 시작 시간 기록
            
            while time.time() - start_time < 100:  # 주어진 시간(100초) 동안 반복
                pass_gate = 0
                fail_gate = 0  # 입력 상태 초기화
                
                # 통과 및 실패 상태 감지
                pass_gate = self.inputdetector.detect_input_pass()
                fail_gate = self.inputdetector.detect_input_fail()
                
                try:
                    distance = self.sensor.measure_distance()  # 거리 측정
                    print(f"측정된 거리: {distance:.2f} cm")
                    
                    # 거리가 20cm 미만이면 사람 통과로 간주
                    if distance < 20:
                        print("사람이 통과. 서보를 다시 동작시킵니다.")
                        self.servo.move(angle=350)  # 서보 모터를 다시 닫음
                        break
                    
                    # 거리 측정에 60초 이상 소요되면 타임아웃 처리
                    if time.time() - start_time > 60:
                        print("Timeout: 거리 측정이 너무 오래 걸렸습니다.")
                        break
                    
                    time.sleep(0.1)  # 0.1초 간격으로 반복
                except Exception as e:
                    print(f"Error measuring distance: {e}")
                    continue
                
                # 통과 또는 실패 감지 시 반복 종료
                if pass_gate == 1 or fail_gate == 1:
                    print("Input state changed! Exiting.")
                    print(pass_gate, fail_gate)
                    break
                
                time.sleep(0.1)  # 0.1초 간격으로 반복
            
            # 통과 감지 시
            if pass_gate == 1:
                self.sound_player.play_pass_sound()  # 통과 사운드 재생
                self.led.blink_green(duration=3, interval=0.5)  # 녹색 LED 깜빡임
                self.servo.move(angle=160)  # 서보 모터를 개방 위치로 이동
                self.event_queue.put("process_nfc")  # NFC 처리 이벤트 큐에 추가
                
            # 실패 감지 시
            elif fail_gate == 1:
                print("fail!")
                self.sound_player.play_alert_sound()  # 경고음 재생
                self.servo.move(angle=350)  # 서보 모터를 닫음
                self.led.blink_red(duration=3, interval=0.5)  # 빨간 LED 깜빡임
                time.sleep(2)  # 2초 대기
                self.event_queue.put("process_nfc")  # NFC 처리 이벤트 큐에 추가
                
            # 통과 및 실패가 모두 감지되지 않은 경우
            else:
                self.servo.move(angle=340)  # 서보 모터를 닫음
                self.sound_player.play_alert_sound()  # 경고음 재생
                print("제대로 인식 못함")
                self.event_queue.put("process_nfc")  # NFC 처리 이벤트 큐에 추가
                
        except Exception as e:
            print(f"Error processing servo: {e}")
            raise e  # 예외를 상위 호출자로 전달

    def cleanup(self):
        # 서보 모터 정지 및 GPIO 정리
        self.servo.stop()
        ServoMotor.cleanup_gpio()
