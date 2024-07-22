# pip3 install rpi-lgpio  추가

import RPi.GPIO as GPIO
from time import sleep

servo_pin = 12

GPIO.setmode(GPIO.BCM)
GPIO.setup(servo_pin, GPIO.OUT);3

GPIO.setup(16, GPIO.OUT)


pwm = GPIO.PWM(servo_pin, 50)
pwm.start(0)


pwm.ChangeDutyCycle(7)
sleep(1)
pwm.ChangeDutyCycle(2)
sleep(1)

pwm.stop()

GPIO.output(16, True)
sleep(2)
GPIO.output(16, False)

GPIO.cleanup()