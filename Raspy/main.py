import schedule
import time
import json
import asyncio
import client
import widgetLoader
from PIL import Image,ImageDraw,ImageFont

grid = []

async def init():
    # get the latest config data from server
    config = await client.get_config()

    # init all the widgets that are in the current grid
    init_widgets(config.text)

    # schedule job per widget for refreshing their data

    # schedule a job for refreshing the screen
    schedule.every(3).seconds.do(draw_board)

    while True:
        schedule.run_pending()
        time.sleep(1)

def init_widgets(configStr):
    global grid

    # get object for each widget class
    grid = json.loads(configStr)['grid']

    for widget in grid:
        widget['ref'] = widgetLoader.getWidgeRef(widget['id'])
    
    print(grid)

def draw_board():

    board_img = Image.new(mode='1', size=(400, 800), color=255)

    # draw all widgets
    for widget in grid:
        img = widget['ref'].render()
        board_img.paste(img, (100*widget['x'], 100*widget['y']))
    
    board_img.show()

    print("draw board")


if __name__ == '__main__':
    asyncio.run(init())