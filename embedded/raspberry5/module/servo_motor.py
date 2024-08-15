import RPi.GPIO as GPIO
from time import sleep

# 서보 핀과 LED 핀 설정
# SERVO_PIN = 12


class ServoMotor:
    def __init__(self, pin=12):
        self.SERVO_PIN = pin
        GPIO.setmode(GPIO.BCM)  # GPIO 모드를 설정합니다. 이 설정은 인스턴스가 생성될 때 한 번만 수행하면 됩니다.
        GPIO.setup(self.SERVO_PIN, GPIO.OUT)
        self.pwm = GPIO.PWM(self.SERVO_PIN, 50)  # 주파수 50Hz
        self.pwm.start(0)

    def angle_to_duty_cycle(self, angle):
        """각도를 duty cycle로 변환"""
        if angle < 0:
            angle = 0
        elif angle > 180:
            angle = 180
        duty_cycle = 2 + (angle / 180) * 5  # 2ms에서 7ms로 변환
        return duty_cycle

    def move(self, angle):
        """서보 모터를 특정 각도로 이동"""
        duty_cycle = self.angle_to_duty_cycle(angle)
        self.pwm.ChangeDutyCycle(duty_cycle)
        sleep(0.5)  # 서보 모터가 이동하는 시간을 기다림
        self.pwm.ChangeDutyCycle(0)  # 모터의 떨림 방지

    def stop(self):
        """서보 모터 정지"""
        self.pwm.stop()

    @staticmethod
    def setup_gpio():
        """GPIO 핀 설정 함수"""
        GPIO.setmode(GPIO.BCM)

    @staticmethod
    def cleanup_gpio():
        """GPIO 청소 함수"""
        GPIO.cleanup()

def main():
    """메인 함수"""
    servo.setup_gpio()

    servo = ServoMotor(SERVO_PIN)

    try:
        # 서보 모터를 이동시키고 LED를 제어합니다.
        servo.move(angle=0)  # 10도 위치로 이동
        sleep(1)  # 서보 모터가 동작한 후 잠시 대기
        servo.move(angle=170)  # 170도 위치로 이동
        sleep(1)
        servo.move(angle=0)  # 10도 위치로 이동

    finally:
        servo.stop()
        servo.cleanup_gpio()

if __name__ == "__main__":
    main()
