import textwrap

from .widget import Widget

class TodoWidget(Widget):

    def render(self):
        print('rendering todo widget')

        self.create_image(font_size=16)
        self.draw_skeleton_image('todo')

        # draw todo list
        y_text = 30
        for item in self.config['config']['items']:
            note_lines = textwrap.wrap(item, width=round(self.widget_width* 0.1))
            count = 0
            for line in note_lines:
                width, height = self._content_font.getsize(line)
                text = "• " + line if count==0 else line
                self._widget_draw.text((20, y_text), text, font=self._content_font, fill=self.widget_text_color)
                y_text += height
                count += 1
            y_text += 15

        return self._widget_img