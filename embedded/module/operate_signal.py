import RPi.GPIO as GPIO
from time import sleep


def emit_result(pin: int) -> None:
    GPIO.setmode(GPIO.BCM)

    GPIO.setup(pin, GPIO.OUT)

    GPIO.output(pin, True)
    sleep(1)
    GPIO.output(pin, False)
    sleep(0.5)

    GPIO.cleanup()

if __name__ == '__main__':
    emit_result(17)