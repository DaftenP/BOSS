import subprocess
import re
import serial
import time
import pygame

# Initialize pygame mixer
pygame.mixer.init()

# Load the mp3 file
mp3_file_path = "/home/ssafy/Desktop/nfc/alert.mp3"
pygame.mixer.music.load(mp3_file_path)

def get_nfc_uid():
    try:
        # Use a shorter timeout and run the command
        result = subprocess.run(['nfc-poll'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        output = result.stdout
        uid_match = re.search(r'UID \(NFCID1\): ([0-9A-Fa-f ]+)', output)
        if uid_match:
            uid = uid_match.group(1).strip().replace(" ", "")
            return uid
    except subprocess.TimeoutExpired:
        print("Command timed out.")
    except Exception as e:
        print(f"Error running subprocess: {e}")
    return None

def send_uid_via_uart(uid):
    try:
        with serial.Serial(
            port='/dev/ttyAMA0',  # Use the appropriate port
            baudrate=115200,      # Adjust if necessary
            timeout=1             # Adjust timeout if necessary
        ) as ser:
            ser.write(uid.encode())
    except serial.SerialException as e:
        print(f"Serial communication error: {e}")
    except Exception as e:
        print(f"Error with UART communication: {e}")

def play_alert_sound():
    try:
        if not pygame.mixer.music.get_busy():
            pygame.mixer.music.play()
    except pygame.error as e:
        print(f"Error playing sound: {e}")

def main():
    last_uid = None  # Track the last UID to prevent sending the same UID multiple times
    while True:
        uid = get_nfc_uid()
        if uid and uid != last_uid:
            play_alert_sound()
            print(f"NFC UID: {uid}")
            send_uid_via_uart(uid)
            last_uid = uid  # Update last UID
        elif uid is None:
            print("NFC 태그를 찾을 수 없습니다.")
        
        time.sleep(0.5)  # Reduce sleep time to check more frequently

if __name__ == "__main__":
    main()
