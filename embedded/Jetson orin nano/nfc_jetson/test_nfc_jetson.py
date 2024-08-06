import serial

ser = serial.Serial('/dev/ttyTHS0', 115200, timeout=1)
while True:
    if ser.in_waiting > 0:
        data = ser.readline().decode('utf-8').strip()
        print(f"Received: {data}")
        break
ser.close()

