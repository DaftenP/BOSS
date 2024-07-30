from datetime import datetime

import requests

BASE_URI = r'https://i11e102.p.ssafy.io/api/'


def get_member_info(nfc_id: str):
    response = requests.get(BASE_URI + f'member/{nfc_id}')
    print(response.status_code)
    print(response.text)


def post_log(log: dict):
    response = requests.post(BASE_URI + 'log/regist', json=log)
    print(response.status_code)


# Test Code
# if __name__ == '__main__':
#     # get_member_info('1234')
#     data = {"member_id": 1,
#             "time": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S"),
#             "deviceFrontImage": "front.jpg",
#             "deviceBackImage": "back.jpg",
#             "entering": 1,
#             "gateNumber": 1,
#             "stickerCount": 3,
#             "issue": 0,
#             "cameraLens": 0
#             }
#     post_log(data)
