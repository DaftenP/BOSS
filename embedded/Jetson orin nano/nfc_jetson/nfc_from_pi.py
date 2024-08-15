import serial

def receive_uid_via_uart():
    ser = serial.Serial(port='/dev/ttyTHS0', baudrate=115200, timeout=1)
    
    uid = None
    while True:
        if ser.in_waiting > 0:
            uid = ser.readline().decode('utf-8').strip()
            if uid:
                print(f"Received NFC UID: {uid}")
            else:
                print("No UID received.")


if __name__ == "__main__":
    receive_uid_via_uart()
