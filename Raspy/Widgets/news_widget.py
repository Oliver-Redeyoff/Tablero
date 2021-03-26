from PIL import Image,ImageDraw,ImageFont
import textwrap
import requests

class widget:

    def __init__(self, config, tileSize):
        self.config = config
        self.tileSize = tileSize
        print('todo widget initialised')

    def getNews(self):
        url = "https://newsapi.org/v2/top-headlines?"
        url += "language=en"
        url += "&pageSize=3"
        url += "&apiKey=72d48922d4644d03bcda247a8ba59479"

        response = requests.get(url)
        print("got news")
        data = response.json()

        articles = []
        for article in data['articles']:
            articles.append(article['title'])
        
        return data['articles']

    def render(self):
        print('rendering note')
        newsData = self.getNews()
        print(newsData)

        bg_color = 255 if self.config['config']['colorMode']=='light' else 0
        text_color = 0 if self.config['config']['colorMode']=='light' else 255

        widget_width = self.tileSize*self.config['width'] - 10
        widget_height = self.tileSize*self.config['height'] - 10

        widget_img = Image.new(mode='1', size=(widget_width, widget_height), color=bg_color)
        widget_draw = ImageDraw.Draw(widget_img)
        title_font = ImageFont.load_default()
        content_font = ImageFont.truetype('OpenSans.ttf', 16)
        
        widget_draw.rectangle(xy=[(0, 0), (widget_width, widget_height)], outline=0, width= 5)

        widget_draw.text(xy=(10, 10), text='news', font=title_font, fill=text_color)

        x = 20
        y = 30
        for article in newsData:
            source = article['source']['name']
            sourceSize = content_font.getsize(source)
            widget_draw.rectangle(xy=[(x-5, y), (x+sourceSize[0]+5, y+25)], fill= text_color)
            widget_draw.text(xy=(x, y), text=source, font=content_font, fill=bg_color)

            title = article['title']
            note_lines = textwrap.wrap(title, width=round(widget_width* 0.12))
            y_text = y
            for line in note_lines:
                widget_draw.text(xy=(x+sourceSize[0]+10, y_text), text=line, font=title_font, fill=text_color)
                y_text += 15
            #widget_draw.text(xy=(x+sourceSize[0]+10, y), text=article['title'], font=title_font, fill=text_color)

            y += 40
        

        return widget_img