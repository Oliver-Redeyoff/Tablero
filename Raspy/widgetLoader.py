from Widgets.note_widget import NoteWidget
from Widgets.weather_widget import WeatherWidget
from Widgets.todo_widget import TodoWidget
from Widgets.picture_widget import PictureWidget
from Widgets.calendar_widget import CalendarWidget
from Widgets.news_widget import NewsWidget

# TODO Factory + dictionary
def getWidgeRef(id, widgetData, tileSize, boardBgColor):
    if id == 0: return NoteWidget(widgetData, tileSize, boardBgColor)
    if id == 1: return WeatherWidget(widgetData, tileSize, boardBgColor)
    if id == 2: return TodoWidget(widgetData, tileSize, boardBgColor)
    if id == 3: return PictureWidget(widgetData, tileSize, boardBgColor)
    if id == 4: return CalendarWidget(widgetData, tileSize, boardBgColor)
    if id == 5: return NewsWidget(widgetData, tileSize, boardBgColor)

    raise ValueError(f'Widget id: {id} is invalid')
