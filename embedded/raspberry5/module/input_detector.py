import RPi.GPIO as GPIO
import time

class InputDetector:
    def __init__(self, pass_pin=17, fail_pin=18):
        """입력 감지기 초기화 및 핀 설정"""
        self.pass_pin = pass_pin
        self.fail_pin = fail_pin
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.pass_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        GPIO.setup(self.fail_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        
    def detect_input_pass(self):
        """통과 핀의 입력을 감지"""
        input_state = GPIO.input(self.pass_pin)
        if input_state == GPIO.HIGH:
            return 1
        else:
            return 0
    
    def detect_input_fail(self):
        """실패 핀의 입력을 감지"""
        input_state = GPIO.input(self.fail_pin)
        if input_state == GPIO.HIGH:
            return 1
        else:
            return 0

    @staticmethod
    def cleanup():
        """GPIO 설정 정리"""
        GPIO.cleanup()

    @staticmethod
    def main():
        detector = InputDetector()  # InputDetector 클래스의 인스턴스 생성

        try:
            while True:
                # pass_pin 감지
                pass_pin = detector.detect_input_pass()
                fail_pin = detector.detect_input_fail()
                
                if pass_pin == 1:
                    print("Input detected on pass_pin!")
                    pass_pin = 0
                    break
              
                
                # fail_pin 감지
                if fail_pin == 1:
                    print("Input detected on fail_pin!")
                    fail_pin = 0
                    break
                
                detector.cleanup()
                time.sleep(0.5)  # 감지 간격을 0.5초로 설정
                
        except KeyboardInterrupt:
            print("Program terminated by user.")
            
        finally:
            detector.cleanup()  # GPIO 리소스 정리

if __name__ == "__main__":
    
    InputDetector.main()
