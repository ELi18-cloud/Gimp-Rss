import webview
import os
import sys
if getattr(sys, 'frozen', False):
    base_path = sys._MEIPASS  # For PyInstaller
    write_base = os.path.dirname(sys.executable)
    url = sys.argv[1]
else:
    base_path = os.path.dirname(__file__)
    write_base = os.path.dirname(__file__)
    url = sys.argv[1]
if '--onTop' in sys.argv:
    top = True
else:
    top = False

print(top)
screen = webview.screens[0]
icopath = os.path.join(base_path,'web','Resources','GimpRSSLogo2.ico')
webview.create_window(title='Gimp RSS', 
                      url=url,
                      background_color='#ffffff',
                      width = screen.width,
                      height = screen.height,
                      resizable = True,
                      on_top = top)
webview.start()