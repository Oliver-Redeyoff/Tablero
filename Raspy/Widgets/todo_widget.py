from PIL import Image,ImageDraw,ImageFont
import textwrap

class widget:

    def __init__(self, config, tileSize):
        self.config = config
        self.tileSize = tileSize
        print('todo widget initialised')

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

        widget_draw.text(xy=(10, 10), text='todo', font=title_font, fill=text_color)

        y_text = 30
        for item in self.config['config']['items']:
            note_lines = textwrap.wrap(item, width=round(widget_width* 0.1))
            count = 0
            for line in note_lines:
                width, height = content_font.getsize(line)
                text = "• " + line if count==0 else line
                widget_draw.text((20, y_text), text, font=content_font, fill=text_color)
                y_text += height
                count += 1
            y_text += 15

        return widget_img