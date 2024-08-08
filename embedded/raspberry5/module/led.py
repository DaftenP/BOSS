import RPi.GPIO as GPIO
from time import sleep

class LED:
    def __init__(self, pin=16):
        """LED 초기화 및 핀 설정"""
        self.LED_pin = pin
        GPIO.setup(self.LED_pin, GPIO.OUT)
        
    def turn_on(self):
        """LED를 켭니다."""
        GPIO.output(self.LED_pin, True)
        
    def turn_off(self):
        """LED를 끕니다."""
        GPIO.output(self.LED_pin, False)

    def blink(self, duration=1, interval=0.5):
        """LED를 깜박이게 합니다.
        duration: 전체 깜박이는 시간 (초)
        interval: 깜박임 간격 (초)
        """
        self.turn_on()
        sleep(interval)
        self.turn_off()
        sleep(interval)
        self.turn_on()
        sleep(interval)
        self.turn_off()
        sleep(interval)
