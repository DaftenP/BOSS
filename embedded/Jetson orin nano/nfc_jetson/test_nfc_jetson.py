import serial

ser = serial.Serial('/dev/ttyTHS0', 115200, timeout=1)
while True:
    if ser.in_waiting > 0:
        try:
            data = ser.readline().decode('utf-8').strip()
        except UnicodeDecodeError:
            data = ser.readline()
        print(data)
        break
ser.close()