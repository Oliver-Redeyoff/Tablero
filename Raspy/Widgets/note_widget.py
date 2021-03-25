from PIL import Image,ImageDraw,ImageFont

class widget:

    def __init__(self, data):
        self.data = data
        print('note widget initialised')

    def render(self):
        print('rendering weather')
        widget_img = Image.new(mode='1', size=(100, 100), color=0)
        widget_draw = ImageDraw.Draw(widget_img)
        fnt = ImageFont.load_default()
        
        widget_draw.rectangle(xy=[(0, 0), (100, 100)], outline=255, width= 5)
        widget_draw.text(xy=(10, 10), text='note', font=fnt, fill=255)

        return widget_img