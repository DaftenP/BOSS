import RPi.GPIO as GPIO

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
