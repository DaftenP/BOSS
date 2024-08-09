import serial

class UARTCommunication:
    def __init__(self, port='/dev/ttyAMA0', baudrate=115200):
        """Initialize the UART connection."""
        self.port = port
        self.baudrate = baudrate
        self.ser = None

    def setup_uart(self):
        """Set up UART connection."""
        self.ser = serial.Serial(self.port, self.baudrate, timeout=1)

    def send_uid(self, uid):
        """Send UID via UART."""
        try:
            if self.ser is None:
                self.setup_uart()
            self.ser.write(uid.encode())
        except serial.SerialException as e:
            print(f"Serial communication error: {e}")
        except Exception as e:
            print(f"Error with UART communication: {e}")
        #finally:
            #self.cleanup()

    def receive_message(self):
        """Receive message via UART."""
        try:
            if self.ser is None:
                self.setup_uart()
            if self.ser.in_waiting > 0:
                # UART로부터 데이터 수신
                message = self.ser.readline().decode('utf-8').strip()
                if message:
                    print(f"Received message: {message}")
                    return message
                else:
                    print("No message received.")
                    return None
        except serial.SerialException as e:
            print(f"Serial communication error: {e}")
            return None
        except Exception as e:
            print(f"Error with UART communication: {e}")
            return None
        finally:
            self.cleanup()

    def cleanup(self):
        """Close the UART connection."""
        if self.ser and self.ser.is_open:
            self.ser.close()
