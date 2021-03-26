from PIL import Image,ImageDraw,ImageFont
from datetime import datetime
from calendar import monthrange
import textwrap

class widget:

    def __init__(self, config, tileSize, boardBgColor):
        self.config = config
        self.tileSize = tileSize
        self.boardBgColor = boardBgColor
        print('calendar widget initialised')

    def render(self):
        print('rendering calendar widget')

        # set all required variables
        bg_color = 255 if self.config['config']['colorMode']=='light' else 0
        text_color = 0 if self.config['config']['colorMode']=='light' else 255

        widget_width = self.tileSize*self.config['width'] - 10
        widget_height = self.tileSize*self.config['height'] - 10

        widget_img = Image.new(mode='1', size=(widget_width, widget_height), color=bg_color)
        widget_draw = ImageDraw.Draw(widget_img)
        title_font = ImageFont.load_default()
        content_font = ImageFont.truetype('OpenSans.ttf', 14)
        
        # draw frame
        widget_draw.rectangle(
            xy = [(0, 0), (widget_width, widget_height)], 
            outline = (255-bg_color if self.boardBgColor==self.config['config']['colorMode'] else bg_color), 
            width = 5
        )

        # draw widget title
        widget_draw.text(xy=(10, 10), text='calendar', font=title_font, fill=text_color)

        # draw calendar
        today = datetime.now()
        monthRange = monthrange(today.year, today.month)
        dateYearSize = content_font.getsize(today.strftime("%B %Y"))
        widget_draw.text(xy=(widget_width/2 - dateYearSize[0]/2, 10), text=today.strftime("%B %Y"), font=content_font, fill=text_color)

        intial_x = round(widget_width*0.1)
        x = intial_x
        y = 40
        dateCubeWidth = round((widget_width - x*2)/7)
        dateCubeHeight = round((widget_height-y-20)/4)
        for date in range(monthRange[0], monthRange[1]+1):
            dateSize = content_font.getsize(str(date))
            widget_draw.text(xy=(x - dateSize[0]/2, y), text=str(date), font=content_font, fill=text_color)

            if today.day == date:
                widget_draw.rectangle(xy=[(x-dateCubeWidth/2, y-2), (x+dateCubeWidth/2, y+dateCubeHeight)], outline=text_color, width= 2)

            x += dateCubeWidth
            if(x >= widget_width):
                x = intial_x
                y += dateCubeHeight
            
        return widget_img