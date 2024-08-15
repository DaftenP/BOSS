from module.nfc import NFCReader
from module.uart import UARTCommunication
from module.sound import SoundPlayer

class NFCHandler:
    def __init__(self, event_queue):
        # NFC 리더, UART 통신 및 사운드 재생 객체 초기화
        self.nfc_reader = NFCReader()  # NFC 리더 객체 생성
        self.uart_comm = UARTCommunication()  # UART 통신 객체 생성
        self.sound_player = SoundPlayer()  # 사운드 재생 객체 생성
        self.last_uid = None  # 마지막으로 읽은 UID를 저장하기 위한 변수
        self.uid_str = None  # 현재 읽은 UID를 저장하기 위한 변수
        self.event_queue = event_queue  # 이벤트 큐 객체

    def process(self):
        try:
            # NFC 리더로부터 UID를 읽음
            self.uid_str = self.nfc_reader.read()
            
            # 새로운 UID가 읽혔고, 이전에 읽은 UID와 다를 경우
            if self.uid_str is not None and self.uid_str != self.last_uid:
                print(f"NFC UID: {self.uid_str}")  # 읽은 UID 출력
                self.uart_comm.send_uid(self.uid_str)  # UID를 UART로 전송
                self.sound_player.play_check_sound()  # 확인 사운드 재생
                # self.last_uid = self.uid_str  # 마지막 UID 업데이트
                self.event_queue.put("process_servo")  # 서보 모터 처리 이벤트 큐에 추가
            
            # 동일한 UID가 반복하여 읽혔을 경우
            elif self.uid_str == self.last_uid:
                self.sound_player.play_alert_sound()  # 경고음 재생
                print("이미 NFC 태깅된 카드입니다.")  # 이미 태깅된 카드 메시지 출력
                self.event_queue.put("process_nfc")  # NFC 처리 이벤트 큐에 추가
            
            # UID를 읽지 못한 경우
            else:
                print("NFC 태그를 찾을 수 없습니다.")  # 태그를 찾을 수 없다는 메시지 출력
                self.event_queue.put("process_nfc")  # NFC 처리 이벤트 큐에 추가
        
        except Exception as e:
            # 예외 발생 시 에러 메시지 출력 후 예외를 상위로 전달
            print(f"Error reading NFC UID: {e}")
            raise e
