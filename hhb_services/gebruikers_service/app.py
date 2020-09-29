import os
from flask import Flask
from hhb_services.database import db
from gebruikers_service.views import (
    GebruikerView, 
    GebruikerDetailView, 
    BurgerView
)

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

from hhb_models import *

# Views
app.add_url_rule('/gebruiker/', view_func=GebruikerView.as_view('gebruiker_view'))
app.add_url_rule('/gebruiker/<gebruiker_id>', view_func=GebruikerDetailView.as_view('gebruiker_detail_view'))
app.add_url_rule('/gebruiker/<gebruiker_id>/burger/', view_func=BurgerView.as_view('burger_view'))

if __name__ == '__main__':
    app.run()