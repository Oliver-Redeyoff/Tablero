from Widgets.note_widget import NoteWidget
from Widgets.weather_widget import WeatherWidget
from Widgets.todo_widget import TodoWidget
from Widgets.picture_widget import PictureWidget
from Widgets.calendar_widget import CalendarWidget
from Widgets.news_widget import NewsWidget

class WidgetFactory:
    def __init__(self):
        self.widget_mappings = {
            'note': NoteWidget,
            'weather': WeatherWidget,
            'todo': TodoWidget,
            'picture': PictureWidget,
            'calendar': CalendarWidget,
            'news': NewsWidget,
        }

    def create_widget(self, widget_id, widgetData, tileSize, boardBgColor):
        # try:
        #     return self.widget_mappings[widget_id](widgetData, tileSize, boardBgColor)
        # except KeyError as key_error:
        #     raise ValueError(f'Invalid widget_id "{widget_id}"') from key_error

        if widget_id == 0: return NoteWidget(widgetData, tileSize, boardBgColor)
        if widget_id == 1: return WeatherWidget(widgetData, tileSize, boardBgColor)
        if widget_id == 2: return TodoWidget(widgetData, tileSize, boardBgColor)
        if widget_id == 3: return PictureWidget(widgetData, tileSize, boardBgColor)
        if widget_id == 4: return CalendarWidget(widgetData, tileSize, boardBgColor)
        if widget_id == 5: return NewsWidget(widgetData, tileSize, boardBgColor)
        raise Exception(f'Invalid widget_id {widget_id}')