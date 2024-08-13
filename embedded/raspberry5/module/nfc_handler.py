from module.nfc import NFCReader
from module.uart import UARTCommunication
from module.sound import SoundPlayer

class NFCHandler:
    def __init__(self, event_queue):
        self.nfc_reader = NFCReader()
        self.uart_comm = UARTCommunication()
        self.sound_player = SoundPlayer()
        self.last_uid = None
        self.uid_str = None
        self.event_queue = event_queue

    def process(self):
        try:
            self.uid_str = self.nfc_reader.read()
            if self.uid_str is not None and self.uid_str != self.last_uid:
                print(f"NFC UID: {self.uid_str}")
                self.uart_comm.send_uid(self.uid_str)
                self.sound_player.play_check_sound()
                self.last_uid = self.uid_str
                self.event_queue.put("process_servo")
            elif self.uid_str == self.last_uid:
                self.sound_player.play_alert_sound()
                print("이미 NFC 태깅된 카드입니다.")
                self.event_queue.put("process_nfc")
            else:
                print("NFC 태그를 찾을 수 없습니다.")
                self.event_queue.put("process_nfc")
        except Exception as e:
            print(f"Error reading NFC UID: {e}")
            raise e
