import serial

ser = serial.Serial('/dev/ttyAMA0', 115200, timeout=1)
ser.write(b'hello, jetson\n')
ser.close()