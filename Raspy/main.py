import schedule
import time
import json
import asyncio
import client


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

def init_widgets(gridStr):
    # get object for each widget class
    grid = json.loads(gridStr)
    print(grid)

def draw_board():
    # draw all widgets
    print("draw board")


if __name__ == '__main__':
    asyncio.run(init())