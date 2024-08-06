import RPi.GPIO as GPIO
import time

# GPIO 핀 번호 설정
TRIG = 23
ECHO = 24
SERVO_PIN = 12
LED_PIN = 16

class UltrasonicSensor:
    def __init__(self, trig_pin=TRIG, echo_pin=ECHO):
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

class ServoMotor:
    def __init__(self, pin=SERVO_PIN):
        self.servo_pin = pin
        GPIO.setup(self.servo_pin, GPIO.OUT)
        self.pwm = GPIO.PWM(self.servo_pin, 50)
        self.pwm.start(0)

    def set_angle(self, angle):
        duty = 2 + (angle / 18)
        self.pwm.ChangeDutyCycle(duty)
        time.sleep(1)

    def cleanup(self):
        self.pwm.stop()
        GPIO.cleanup()

def main():
    """메인 루프 함수"""
    print("초음파 거리 측정기 및 서보 모터 제어")
    
    ultrasonic_sensor = UltrasonicSensor()
    servo_motor = ServoMotor()
    GPIO.setup(LED_PIN, GPIO.OUT)

    try:
        while True:
            distance = ultrasonic_sensor.measure_distance()
            print(f"거리: {distance:.2f} cm")
            
            if distance <= 20:
                print("물체가 탐지되었습니다!", distance)
                servo_motor.set_angle(90)  # 서보모터 각도 90도로 설정
                GPIO.output(LED_PIN, True)  # LED 켜기
            else:
                servo_motor.set_angle(0)   # 서보모터 각도 0도로 설정
                GPIO.output(LED_PIN, False)  # LED 끄기
                
            time.sleep(0.1)
            
    except KeyboardInterrupt:
        print("거리 측정 완료")
    finally:
        ultrasonic_sensor.cleanup()
        servo_motor.cleanup()

if __name__ == "__main__":
    main()
