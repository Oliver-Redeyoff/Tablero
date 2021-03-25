import schedule
import time
import json
import asyncio
import client
import widgetLoader
from PIL import Image,ImageDraw,ImageFont

grid = []
refreshFrequency = 10
gridTileSize = 100

async def init():
    global refreshFrequency, gridTileSize, grid

    # get the latest config data from server
    config = json.loads(await client.get_config())
    grid = config['grid']
    refreshFrequency = config['config']['refreshFrequency']
    gridTileSize = config['config']['gridTileSize']

    # init all the widgets that are in the current grid
    init_widgets(config)

    # schedule job per widget for refreshing their data

    # schedule a job for refreshing the screen
    schedule.every(refreshFrequency).seconds.do(draw_board)

    while True:
        schedule.run_pending()
        time.sleep(1)

def init_widgets(configStr):
    global refreshFrequency, gridTileSize, grid

    for widget in grid:
        widget['ref'] = widgetLoader.getWidgeRef(widget['id'])
    
    print(grid)

def draw_board():
    global refreshFrequency, gridTileSize, grid

    print("drawing board")
    board_img = Image.new(mode='1', size=(400, 800), color=255)
    
    # render all widgets
    for widget in grid:
        img = widget['ref'].render()
        board_img.paste(img, (gridTileSize*widget['x'], gridTileSize*widget['y']))
    
    # use this for dev
    board_img.show()


if __name__ == '__main__':
    asyncio.run(init())