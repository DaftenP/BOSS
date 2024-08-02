import subprocess
import re

def get_nfc_uid():
    """
    NFC 태그의 UID를 읽어 반환합니다.
    """
    # nfc-poll 명령어 실행
    result = subprocess.run(['nfc-poll'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    # 명령어 출력 파싱
    output = result.stdout
    uid_match = re.search(r'UID \(NFCID1\): ([0-9A-Fa-f ]+)', output)

    if uid_match:
        uid = uid_match.group(1).strip().replace(" ", "")
        return uid
    else:
        return None
