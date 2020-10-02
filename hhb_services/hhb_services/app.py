from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
db = SQLAlchemy(app)

from hhb_models import *

# This app is not actually run as flask service
# it functions as a manager app for databas migrations
# and global Flask config sttings