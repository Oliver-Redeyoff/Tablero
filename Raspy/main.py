import schedule
import time
import ecranClient

def init():
    # get the latest config data from server
    ecranClient.get_config()

    # init all the widgets that are in the current grid
    init_widgets()

    # schedule job per widget for refreshing their data

    # schedule a job for refreshing the screen
    schedule.every(3).seconds.do(draw_board)

def init_widgets():
    # get object for each widget class
    print("init_widgets");

def draw_board():
    # draw all widgets
    print("draw board")


if __name__ == '__main__':
    init()
    while True:
        schedule.run_pending()
        time.sleep(1)