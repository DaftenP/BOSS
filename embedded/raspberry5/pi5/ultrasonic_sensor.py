import RPi.GPIO as GPIO
import time

class UltrasonicSensor:
    def __init__(self, trig_pin=23, echo_pin=24):
        self.TRIG = trig_pin
        self.ECHO = echo_pin
        self.setup()

    def setup(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self.TRIG, GPIO.OUT)
        GPIO.setup(self.ECHO, GPIO.IN)
        GPIO.output(self.TRIG, False)
        print("초음파 출력 초기화")
        time.sleep(0.5)

    def measure_distance(self):
        """거리 측정 함수"""
        GPIO.output(self.TRIG, True)
        time.sleep(0.00001)
        GPIO.output(self.TRIG, False)
        
        while GPIO.input(self.ECHO) == 0:
            start = time.time()
        
        while GPIO.input(self.ECHO) == 1:
            stop = time.time()
        
        check_time = stop - start
        distance = check_time * 34300 / 2
        return distance

    def cleanup(self):
        GPIO.cleanup()
