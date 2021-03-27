import sys
import os
import time
import json
import asyncio
import logging


from PIL import Image
import requests

from widget_factory import WidgetFactory

libdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'lib')
if os.path.exists(libdir):
    sys.path.append(libdir)
from waveshare_epd import epd7in5_V2

logger = logging.getLogger(__name__)

class Main:
    def __init__(self, url, user_id, secret):
        self.url = url
        self.user_id = user_id
        self.secret = secret

        self.epd = epd7in5_V2.EPD()
        self.grid = []
        self.board_bg_color_mode = 'white'
        self.refresh_frequency = 10
        self.grid_tile_size = 100

        self._loop = asyncio.get_event_loop()
        self._widget_factory = WidgetFactory()

        self._loop.create_task(self.render_loop_task())


    async def render_loop_task(self):
        # get the latest config data from server
        config = self.get_board_config()
        try:
            self.grid = config['grid']
            self.board_bg_color_mode = config['config']['bgColor']
            self.refresh_frequency = config['config']['refreshFrequency']
            self.grid_tile_size = config['config']['gridTileSize']

        except KeyError as key_error:
            logger.critical(f'Error occurred fetching config: {key_error}')

        for widget in self.grid:
            widget['ref'] = self._widget_factory.create_widget(widget['id'], widget, self.grid_tile_size, self.board_bg_color_mode)

        self.epd.init()
        self.epd.Clear()

        print("drawing board")
        board_bg_color = 255 if self.board_bg_color_mode == 'light' else 0
        board_img = Image.new(mode='1', size=(self.epd.height, self.epd.width), color=board_bg_color)
        
        # render all widgets
        for widget in self.grid:
            img = widget['ref'].render()
            board_img.paste(img, (self.grid_tile_size*widget['x']+5, self.grid_tile_size*widget['y']+5))
        
        # use this for dev
        #board_img.show()
        # use this for eink display
        self.epd.display(self.epd.getbuffer(board_img))

        await asyncio.sleep(self.refresh_frequency)
        self._loop.create_task(self.render_loop_task())

    def get_board_config(self):
        resp = requests.post(
            self.url, 
            json = {
                "user_id": "test-user",
                "secret": "password"
            }
        )

        return resp.json()



if __name__ == '__main__':
    main = Main('https://europe-west2-la-hacks-308508.cloudfunctions.net/get-config', 'test-user', 'password')
    asyncio.get_event_loop().run_forever()