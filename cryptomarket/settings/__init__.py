import os


if os.environ.get('FLASK_ENV') == 'production':
    from settings.production import *
else:
    from settings.testing import *