import textwrap

import requests
from PIL import ImageFont

from .widget import Widget

class NewsWidget(Widget):

    def get_news(self):
        url = "https://newsapi.org/v2/top-headlines?"
        url += "language=en"
        url += "&pageSize=3"
        url += "&apiKey=72d48922d4644d03bcda247a8ba59479"

        response = requests.get(url)
        data = response.json()
        
        return data['articles']

    def render(self):
        print('rendering news widget')

        # set all required variables
        news_data = self.get_news()

        self.create_image()
        self.draw_skeleton_image('news')
        news_title_font = ImageFont.truetype('OpenSans.ttf', 10)

        # draw news
        x = 20
        y = 30
        for article in news_data:
            source = article['source']['name']
            source_size = self._content_font.getsize(source)
            self._widget_draw.rectangle(xy=[(x-5, y), (x+source_size[0]+5, y+25)], fill=self.widget_text_color)
            self._widget_draw.text(xy=(x, y+2), text=source, font=self._content_font, fill=self.widget_bg_color)

            title = article['title']
            note_lines = textwrap.wrap(title, width=round((self.widget_width-source_size[0]+10) * 0.17))
            y_text = y
            for line in note_lines:
                self._widget_draw.text(xy=(x+source_size[0]+10, y_text-2), text=line, font=news_title_font, fill=self.widget_text_color)
                y_text += 15

            y += 40
        
        return self._widget_img