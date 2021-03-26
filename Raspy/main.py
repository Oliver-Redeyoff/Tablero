import sys
import os
import schedule
import threading
import time
import json
import asyncio
import client
import widgetLoader
from PIL import Image,ImageDraw,ImageFont
import logging

libdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'lib')
if os.path.exists(libdir):
    sys.path.append(libdir)
from waveshare_epd import epd7in5_V2


epd = epd7in5_V2.EPD()
grid = []
bgColor = 'white'
refreshFrequency = 10
gridTileSize = 100

async def init():
    while True:
        await cycle()
        time.sleep(refreshFrequency)

async def cycle():
    global epd, refreshFrequency, gridTileSize, grid, bgColor
    grid = []
    bgColor = 'white'
    refreshFrequency = 10
    gridTileSize = 100

    # get the latest config data from server and set global vars
    config = json.loads(await client.get_config())
    grid = config['grid']
    bgColor = config['config']['bgColor']
    refreshFrequency = config['config']['refreshFrequency']
    gridTileSize = config['config']['gridTileSize']

    # init all the widgets that are in the current grid
    init_widgets()

    # schedule job per widget for refreshing their data

    # schedule a job for refreshing the screen
    draw_board()


def init_widgets():
    global gridTileSize, grid

    for widget in grid:
        widget['ref'] = widgetLoader.getWidgeRef(widget['id'], widget, gridTileSize)
    
    print(grid)

def draw_board():
    global epd, bgColor, gridTileSize, grid

    epd.init()
    epd.Clear()

    print("drawing board")
    bg_color = 255 if bgColor=='light' else 0
    board_img = Image.new(mode='1', size=(epd.height, epd.width), color=bg_color)
    
    # render all widgets
    for widget in grid:
        img = widget['ref'].render()
        board_img.paste(img, (gridTileSize*widget['x'], gridTileSize*widget['y']))
    
    # use this for dev
    #board_img.show()
    # use this for eink display
    epd.display(epd.getbuffer(board_img))


if __name__ == '__main__':
    asyncio.run(init())
    #schedule.every(refreshFrequency).seconds.do(asyncio.run(init()))
    #while True:
    #    schedule.run_pending()
    #    time.sleep(1)