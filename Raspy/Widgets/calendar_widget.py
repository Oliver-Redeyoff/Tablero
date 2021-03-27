from datetime import datetime
from calendar import monthrange

from .widget import Widget

class CalendarWidget(Widget):

    def render(self):
        print('rendering calendar widget')

        self.create_image()
        self.draw_skeleton_image('calendar')

        # draw calendar
        today = datetime.now()
        monthRange = monthrange(today.year, today.month)
        dateYearSize = self._content_font.getsize(today.strftime("%B %Y"))
        self._widget_draw.text(xy=(self.widget_width/2 - dateYearSize[0]/2, 10), text=today.strftime("%B %Y"), font=self._content_font, fill=self.widget_text_color)

        intial_x = round(self.widget_width*0.1)
        x = intial_x
        y = 40
        dateCubeWidth = round((self.widget_width - x*2)/7)
        dateCubeHeight = round((self.widget_height-y-20)/4)
        for date in range(monthRange[0], monthRange[1]+1):
            dateSize = self._content_font.getsize(str(date))
            self._widget_draw.text(xy=(x - dateSize[0]/2, y), text=str(date), font=self._content_font, fill=self.widget_text_color)

            if today.day == date:
                self._widget_draw.rectangle(xy=[(x-dateCubeWidth/2, y-2), (x+dateCubeWidth/2, y+dateCubeHeight)], outline=self.widget_text_color, width= 2)

            x += dateCubeWidth
            if(x >= self.widget_width):
                x = intial_x
                y += dateCubeHeight
            
        return self._widget_img
