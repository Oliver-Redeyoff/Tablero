from PIL import Image,ImageDraw,ImageFont
import textwrap

class widget:

    def __init__(self, data, tileSize):
        self.data = data
        self.tileSize = tileSize
        print('note widget initialised')

    def render(self):
        print('rendering weather')
        widget_img = Image.new(mode='1', size=(self.tileSize, self.tileSize), color=0)
        widget_draw = ImageDraw.Draw(widget_img)
        font = ImageFont.load_default()
        
        widget_draw.rectangle(xy=[(0, 0), (100, 100)], outline=255, width= 5)

        widget_draw.text(xy=(10, 10), text='note', font=font, fill=255)

        note_lines = textwrap.wrap(self.data['config']['text'], width=15)
        y_text = round(self.tileSize * 0.3)
        for line in note_lines:
            width, height = font.getsize(line)
            widget_draw.text(((100 - width) / 2, y_text), line, font=font, fill=255)
            y_text += height

        return widget_img