from .gebruiker_loader import GebruikersByIdLoader

class HHBDataLoader:

    def __init__(self, loop):
        print("I get instantiated")
        self.gebruikers_by_id = GebruikersByIdLoader(loop=loop)
