import textwrap

from .widget import Widget

class NoteWidget(Widget):

    def render(self):
        print('rendering note widget')

        # set all required variables

        self.create_image()
        self.draw_skeleton_image('note')

        # draw note
        note_lines = textwrap.wrap(self.config['config']['text'], width=round(self.widget_width* 0.12))
        y_text = 30
        for line in note_lines:
            width, height = self._content_font.getsize(line)
            self._widget_draw.text(((self.widget_width - width) / 2, y_text), line, font=self._content_font, fill=self.widget_text_color)
            y_text += height

        return self._widget_img