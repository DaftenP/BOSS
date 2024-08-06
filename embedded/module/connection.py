from datetime import datetime

import requests

BASE_URI = r'https://i11e102.p.ssafy.io/api/'


def get_member_info(nfc_id: str):
    response = requests.get(BASE_URI + f'member/check/{nfc_id}')
    if response.status_code == 200:
        return response.json()
    else:
        print(f'get_member_info : error {response.status_code}')
        return None


def post_log(log: dict):
    response = requests.post(BASE_URI + 'log/regist', json=log)
    return response.status_code


def get_member_logs(member_id: int, issue: bool = True):
    response = requests.get(
        BASE_URI + f'log/search?memberId={member_id}{"&issue=1" if issue else ("&startTime=" + datetime.now().strftime("%Y-%m-%d") + "T00:00:00")}')
    if response.status_code == 200:
        return response.json()
    else:
        print(f'get_member_logs : error {response.status_code}')
        return None

# Test Code
# if __name__ == '__main__':
#     # get_member_info('1234')
#     data = {"memberId": 5,
#             "deviceFrontImage": "front.jpg",
#             "deviceBackImage": "back.jpg",
#             "entering": 1,
#             "gateNumber": 1,
#             "stickerCount": 3,
#             "issue": 1,
#             "cameraLens": 0
#             }
#     post_log(data)
#     get_member_logs(5)
