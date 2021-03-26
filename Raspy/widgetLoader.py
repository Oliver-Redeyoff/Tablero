import Widgets.note_widget as note_widget
import Widgets.weather_widget as weather_widget
import Widgets.todo_widget as todo_widget
import Widgets.picture_widget as picture_widget
import Widgets.calendar_widget as calendar_widget
import Widgets.news_widget as news_widget

def getWidgeRef(id, widgetData, tileSize, boardBgColor):
    if id == 0: return note_widget.widget(widgetData, tileSize, boardBgColor)
    if id == 1: return weather_widget.widget(widgetData, tileSize, boardBgColor)
    if id == 2: return todo_widget.widget(widgetData, tileSize, boardBgColor)
    if id == 3: return picture_widget.widget(widgetData, tileSize, boardBgColor)
    if id == 4: return calendar_widget.widget(widgetData, tileSize, boardBgColor)
    if id == 5: return news_widget.widget(widgetData, tileSize, boardBgColor)
    else : pass
