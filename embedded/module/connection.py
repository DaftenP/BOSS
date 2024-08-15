from datetime import datetime
import aiohttp
import json

BASE_URI = r'https://i11e102.p.ssafy.io/api/'


async def get_member_info(nfc_id: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(BASE_URI + f'member/check/{nfc_id}') as response:
            if response.status == 200:
                return await response.json()
            else:
                print(f'get_member_info : error {response.status} | params : {nfc_id}')
                return None


async def get_member_logs(member_id: int, issue: bool = True):
    async with aiohttp.ClientSession() as session:
        url = BASE_URI + f'log/search?memberId={member_id}{"&issue=1" if issue else ("&startTime=" + datetime.now().strftime("%Y-%m-%d") + "T00:00:00")}'
        async with session.get(url) as response:
            if response.status == 200:
                return await response.json()
            else:
                print(f'get_member_logs : error {response.status}')
                return None


async def get_image(url: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                return await response.read()
            else:
                print(f'get_image : error {response.status}')
                return None


async def post_log(image1, image2, json_data: dict):
    json_str = json.dumps(json_data)
    async with aiohttp.ClientSession() as session:
        # 멀티파트 데이터 생성
        data = aiohttp.FormData()

        data.add_field('deviceFrontImage', image1.tobytes(), filename='deviceFrontImage.jpg', content_type='image/jpeg')
        data.add_field('deviceBackImage', image2.tobytes(), filename='deviceBackImage.jpg', content_type='image/jpeg')
        data.add_field('enteringLogRegistDto', json_str, content_type='application/json')

        async with session.post(BASE_URI + 'log/regist', data=data) as response:
            # 응답 상태 코드와 내용 출력
            print(f'Status: {response.status}')
            response_text = await response.text()
            return response_text

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
