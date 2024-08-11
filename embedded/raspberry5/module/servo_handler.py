import time
from module.servo_motor import ServoMotor
from module.ultrasonic_sensor import UltrasonicSensor
from module.led import LED
from module.sound import SoundPlayer
from module.input_detector import InputDetector

class ServoHandler:
    def __init__(self, event_queue):
        ServoMotor.setup_gpio()
        self.servo = ServoMotor()
        self.sensor = UltrasonicSensor()
        self.led = LED()
        self.sound_player = SoundPlayer()
        self.inputdetector = InputDetector()
        self.event_queue = event_queue

    def process(self):
        try:
            print("서보 동작")
            self.servo.move(angle=0)
            time.sleep(1)
            pass_gate = self.inputdetector.detect_input_pass()
            fail_gate = self.inputdetector.detect_input_fail()
            pass_gate = 1
            if pass_gate == 1:
                self.sound_player.play_pass_sound()
                self.led.blink_green(duration=3, interval=0.5)
                self.servo.move(angle=170)
                start_time = time.time() # 거리측정에 시간이 너무 오래걸릴 경우를 대비한 시간측정
                timeout = 15  # Timeout period in seconds
                time.sleep(2)
                while True:
                    try:
                        distance = self.sensor.measure_distance()
                        print(f"측정된 거리: {distance:.2f} cm")
                        if distance > 20:
                            print("사람이 통과했습니다. 서보를 다시 동작시킵니다.")
                            self.servo.move(angle=0) # 다시 막음
                            break
                        if time.time() - start_time > timeout:
                            print("Timeout: 거리 측정이 너무 오래 걸렸습니다.")
                            break
                        time.sleep(0.1)
                    except Exception as e:
                        print(f"Error measuring distance: {e}")
                        continue
                self.event_queue.put("process_nfc")
            elif fail_gate == 1:
                self.sound_player.play_fail_sound()
                self.led.blink_red(duration=3, interval=0.5)
                self.servo.move(angle=0)
                self.event_queue.put("process_nfc")
            else:
                self.servo.move(angle=0)
                self.sound_player.play_alert_sound()
                print("제대로 인식 못함")
                self.event_queue.put("process_nfc")
        except Exception as e:
            print(f"Error processing servo: {e}")
            raise e

    def cleanup(self):
        self.servo.stop()
        ServoMotor.cleanup_gpio()
