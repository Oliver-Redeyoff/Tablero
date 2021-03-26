from PIL import Image,ImageDraw,ImageFont
import textwrap

class widget:

    def __init__(self, config, tileSize):
        self.config = config
        self.tileSize = tileSize
        print('note widget initialised')

    def render(self):
        print('rendering note')
        bg_color = 255 if self.config['config']['colorMode']=='light' else 0
        text_color = 0 if self.config['config']['colorMode']=='light' else 255

        widget_width = self.tileSize*self.config['width'] - 10
        widget_height = self.tileSize*self.config['height'] - 10

        widget_img = Image.new(mode='1', size=(widget_width, widget_height), color=bg_color)
        widget_draw = ImageDraw.Draw(widget_img)
        title_font = ImageFont.load_default()
        content_font = ImageFont.truetype('OpenSans.ttf', 16)
        
        widget_draw.rectangle(xy=[(0, 0), (widget_width, widget_height)], outline=0, width= 5)

        picture = Image.open('child_criminal.bmp')
        picture = picture.resize((widget_width-10, widget_height-10))
        widget_img.paste(picture, (5, 5))

        

        return widget_img