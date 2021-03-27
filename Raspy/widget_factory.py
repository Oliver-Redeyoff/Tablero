from Widgets.note_widget import NoteWidget
from Widgets.weather_widget import WeatherWidget
from Widgets.todo_widget import TodoWidget
from Widgets.picture_widget import PictureWidget
from Widgets.calendar_widget import CalendarWidget
from Widgets.news_widget import NewsWidget

class WidgetFactory:
    def __init__(self, widget_configs):
        self.widget_mappings = {
            'note': NoteWidget,
            'weather': WeatherWidget,
            'todo': TodoWidget,
            'picture': PictureWidget,
            'calendar': CalendarWidget,
            'news': NewsWidget,
        }

        self.widget_configs = widget_configs

    def create_widget(self, widget_id, widgetData, tileSize, boardBgColor):
        split_widget_id = self.split_widget_id(widget_id)
        if split_widget_id[1] is None:
            widget_size = self.widget_configs[split_widget_id[0]]['size']
        else:
            widget_size = self.widget_configs[split_widget_id[0]][split_widget_id[1]]

        try:
            return self.widget_mappings[split_widget_id[0]](widgetData, widget_size, tileSize, boardBgColor)
        except KeyError as key_error:
            raise ValueError(f'Invalid widget_id "{widget_id}"') from key_error

    def split_widget_id(self, widget_id):
        split_widget_id = widget_id.split("-")
        if len(split_widget_id) == 1:
            split_widget_id.append(None)
            return split_widget_id

        if len(split_widget_id) == 2:
            return split_widget_id

        raise ValueError(f'Expected len of 1 or 2 got "{len(split_widget_id)}" in "{split_widget_id}"')
