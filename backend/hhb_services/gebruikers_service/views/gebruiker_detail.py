from flask.views import MethodView

class GebruikerDetailView(MethodView):

    def get(self, gebruiker_id):
        return {}

    def patch(self, gebruiker_id):
        # TODO
        return {}
    
    def delete(self, gebruiker_id):
        # TODO
        return {}