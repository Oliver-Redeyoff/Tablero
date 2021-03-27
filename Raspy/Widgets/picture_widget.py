from PIL import Image,ImageDraw,ImageFont
import textwrap

class widget:

    def __init__(self, config, tileSize, boardBgColor):
        self.config = config
        self.tileSize = tileSize
        self.boardBgColor = boardBgColor
        print('picture widget initialised')

    def render(self):
        print('rendering picture widget')

        # set all required variables
        bg_color = 255 if self.config['config']['colorMode']=='light' else 0

        widget_width = self.tileSize*self.config['width'] - 10
        widget_height = self.tileSize*self.config['height'] - 10

        widget_img = Image.new(mode='1', size=(widget_width, widget_height), color=bg_color)
        widget_draw = ImageDraw.Draw(widget_img)
        
        # draw frame
        widget_draw.rectangle(
            xy = [(0, 0), (widget_width, widget_height)], 
            outline = (255-bg_color if self.boardBgColor==self.config['config']['colorMode'] else bg_color), 
            width = 5
        )

        # draw picture
        picture = Image.open('dog.bmp')
        picture = picture.resize((widget_width-10, widget_height-10))
        widget_img.paste(picture, (5, 5))

        return widget_img