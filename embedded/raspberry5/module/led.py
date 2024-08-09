import RPi.GPIO as GPIO
from time import sleep, time

class LED:
    def __init__(self, green_pin=27, red_pin=22):
        """LED 초기화 및 핀 설정"""
        self.green_pin = green_pin
        self.red_pin = red_pin
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.green_pin, GPIO.OUT)
        GPIO.setup(self.red_pin, GPIO.OUT)
        
    def turn_on_green(self):
        """초록색 LED를 켭니다."""
        GPIO.output(self.green_pin, True)
        
    def turn_off_green(self):
        """초록색 LED를 끕니다."""
        GPIO.output(self.green_pin, False)
    
    def turn_on_red(self):
        """빨간색 LED를 켭니다."""
        GPIO.output(self.red_pin, True)
        
    def turn_off_red(self):
        """빨간색 LED를 끕니다."""
        GPIO.output(self.red_pin, False)

    def blink_green(self, duration=5, interval=0.5):
        """초록색 LED를 깜박이게 합니다.
        duration: 전체 깜박이는 시간 (초)
        interval: 깜박임 간격 (초)
        """
        end_time = time() + duration
        while time() < end_time:
            self.turn_on_green()
            sleep(interval)
            self.turn_off_green()
            sleep(interval)

    def blink_red(self, duration=5, interval=0.5):
        """빨간색 LED를 깜박이게 합니다.
        duration: 전체 깜박이는 시간 (초)
        interval: 깜박임 간격 (초)
        """
        end_time = time() + duration
        while time() < end_time:
            self.turn_on_red()
            sleep(interval)
            self.turn_off_red()
            sleep(interval)
            
    def cleanup():
        """GPIO 설정 정리"""
        GPIO.cleanup()
