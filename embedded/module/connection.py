from datetime import datetime
import aiohttp

BASE_URI = r'https://i11e102.p.ssafy.io/api/'


async def get_member_info(nfc_id: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(BASE_URI + f'member/check/{nfc_id}') as response:
            if response.status == 200:
                return await response.json()
            else:
                print(f'get_member_info : error {response.status}')
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
