from PIL import Image,ImageDraw,ImageFont
import requests
from io import BytesIO

class widget:

    def __init__(self, config, tileSize):
        self.config = config
        self.tileSize = tileSize
        print('weather widget initialised')

    def getWeather(self):
        weatherUrl = "http://api.openweathermap.org/data/2.5/weather?"
        weatherUrl += "q=" + str(self.config['config']['location'])
        weatherUrl += "&appid=b1fef35e73e92d824c8b42ea70b5e913"

        response = requests.get(weatherUrl)
        print("got weather")
        weatherData = response.json()
        # weatherStr = "Weather in Deal : " + weatherData['weather'][0]['main']
        temp = round(float(weatherData['main']['temp']) - 273.15)

        iconResponse = requests.get("http://openweathermap.org/img/wn/" + weatherData['weather'][0]['icon'] + ".png")
        weatherIcon = Image.open(BytesIO(iconResponse.content))

        return {"icon": weatherIcon, "temp": temp}

    def render(self):
        print('rendering weather')
        weatherData = self.getWeather()

        bg_color = 255 if self.config['config']['colorMode']=='light' else 0
        text_color = 0 if self.config['config']['colorMode']=='light' else 255

        widget_width = self.tileSize*self.config['width']
        widget_height = self.tileSize*self.config['height']

        widget_img = Image.new(mode='1', size=(widget_width, widget_height), color=bg_color)
        widget_draw = ImageDraw.Draw(widget_img)
        fnt = ImageFont.load_default()
        
        widget_draw.rectangle(xy=[(0, 0), (widget_width, widget_height)], outline=text_color, width= 5)

        widget_draw.text(xy=(10, 10), text='weather', font=fnt, fill=text_color)

        tempStr = str(weatherData['temp']) + " °C"
        tempStrSize = fnt.getsize(tempStr)

        widget_draw.text(xy=(widget_width/2 - tempStrSize[0]/2, widget_height-35), text=str(weatherData['temp']) + " °C", font=fnt, fill=text_color)
        weatherIcon = weatherData['icon'].resize((widget_width, widget_height))
        widget_draw.bitmap((0, 0), weatherIcon)

        return widget_img