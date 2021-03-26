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

        widget_width = self.tileSize*self.config['width']
        widget_height = self.tileSize*self.config['height']

        widget_img = Image.new(mode='1', size=(widget_width, widget_height), color=bg_color)
        widget_draw = ImageDraw.Draw(widget_img)
        font = ImageFont.load_default()
        
        widget_draw.rectangle(xy=[(0, 0), (widget_width, widget_height)], outline=text_color, width= 5)

        widget_draw.text(xy=(10, 10), text='note', font=font, fill=text_color)

        note_lines = textwrap.wrap(self.config['config']['text'], width=round(widget_width* 0.1))
        y_text = 30
        for line in note_lines:
            width, height = font.getsize(line)
            widget_draw.text(((widget_width - width) / 2, y_text), line, font=font, fill=text_color)
            y_text += height

        return widget_img