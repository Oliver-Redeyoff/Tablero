from PIL import Image,ImageDraw,ImageFont

class Widget:
    def __init__(self, config, widget_size, tile_size, board_bg_color):
        self.config = config
        # Set colour settings
        widget_color_mode = config.get('colorMode', 'light')

        if widget_color_mode == 'light':
            self.widget_bg_color = 255
            self.widget_text_color = 0
        else:
            self.widget_bg_color = 0
            self.widget_text_color = 255

        if widget_color_mode == board_bg_color:
            self.outline_color = 255 - self.widget_bg_color
        else:
            self.outline_color = self.widget_bg_color
        
        self.widget_width = tile_size * widget_size['width'] - 10
        self.widget_height = tile_size * widget_size['height'] - 10

        self._widget_img = None
        self._widget_draw = None
        self._title_font = None
        self._content_font = None

    def create_image(self, font_size=14):
        """Creates and sets up the widgets Image"""
        self._widget_img = Image.new(mode='1', size=(self.widget_width, self.widget_height,), color=self.widget_bg_color)
        self._widget_draw = ImageDraw.Draw(self._widget_img)
        self._title_font = ImageFont.load_default()
        self._content_font = ImageFont.truetype('OpenSans.ttf', font_size)

    def draw_skeleton_image(self, name):
        if any(value is None for value in [self._widget_draw, self._title_font, self._content_font]):
            raise ValueError('Call self.create_image before self.draw_skeleton_image')

        self._widget_draw.rectangle(
            xy = [(0, 0), (self.widget_width, self.widget_height)], 
            outline = self.outline_color, 
            width = 5
        )

        # draw widget title
        self._widget_draw.text(xy=(10, 10), text=name, font=self._title_font, fill=self.widget_text_color)
