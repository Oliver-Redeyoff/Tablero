from PIL import Image,ImageDraw,ImageFont
import textwrap

class widget:

    def __init__(self, config):
        self.config = config
        print('note widget initialised')
        print(self.config)

    def render(self):
        print('rendering weather')
        widget_img = Image.new(mode='1', size=(100, 100), color=0)
        widget_draw = ImageDraw.Draw(widget_img)
        font = ImageFont.load_default()
        
        widget_draw.rectangle(xy=[(0, 0), (100, 100)], outline=255, width= 5)

        widget_draw.text(xy=(10, 10), text='note', font=font, fill=255)

        note_lines = textwrap.wrap(self.config['text'], width=15)
        y_text = 30
        for line in note_lines:
            width, height = font.getsize(line)
            widget_draw.text(((100 - width) / 2, y_text), line, font=font, fill=255)
            y_text += height

        return widget_img