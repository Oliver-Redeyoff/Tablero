from PIL import Image

from .widget import Widget

class PictureWidget(Widget):

    def render(self):
        print('rendering picture widget')

        self.create_image()
        self.draw_skeleton_image('')

        # draw picture
        picture = Image.open('dog.bmp')
        picture = picture.resize((self.widget_width-10, self.widget_height-10))
        self._widget_img.paste(picture, (5, 5))

        return self._widget_img