import Widgets.note_widget as note_widget
import Widgets.weather_widget as weather_widget

def getWidgeRef(id, widgetConfig):
    if id == 0: return note_widget.widget(widgetConfig)
    if id == 1: return weather_widget.widget(widgetConfig)
    else : pass
