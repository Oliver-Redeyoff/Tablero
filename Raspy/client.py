import requests

async def get_config():
    url = "https://europe-west2-la-hacks-308508.cloudfunctions.net/get-config"
    body = {
        "user_id": "test-user",
        "secret": "password"
    }

    resp = requests.post(url, json = body)

    return resp.text