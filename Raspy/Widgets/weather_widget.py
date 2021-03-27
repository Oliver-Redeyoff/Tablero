from PIL import Image
import requests
from io import BytesIO

import requests

from .widget import Widget

class WeatherWidget(Widget):

    def getWeather(self):
        weatherUrl = "http://api.openweathermap.org/data/2.5/weather?"
        weatherUrl += "q=" + str(self.config['config']['location'])
        weatherUrl += "&appid=b1fef35e73e92d824c8b42ea70b5e913"

        response = requests.get(weatherUrl)
        weatherData = response.json()
        temp = round(float(weatherData['main']['temp']) - 273.15)

        iconResponse = requests.get("http://openweathermap.org/img/wn/" + weatherData['weather'][0]['icon'] + ".png")
        weatherIcon = Image.open(BytesIO(iconResponse.content))

        return {"icon": weatherIcon, "temp": temp}

    def render(self):
        print('rendering weather widget')

        # set all required variables
        weatherData = self.getWeather()

        self.create_image(font_size=16)
        self.draw_skeleton_image('weather')

        # draw weather
        tempStr = str(weatherData['temp']) + " °C in " + self.config['config']['location']
        tempStrSize = self._content_font.getsize(tempStr)

        self._widget_draw.text(xy=(self.widget_width/2 - tempStrSize[0]/2, self.widget_height-40), text=tempStr, font=self._content_font, fill=self.widget_text_color)
        weatherIcon = weatherData['icon'].resize((self.widget_width, self.widget_height))
        self._widget_draw.bitmap((0, -5), weatherIcon)

        return self._widget_img