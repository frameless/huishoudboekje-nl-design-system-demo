
class User():
    def __init__(self, name: str = None):
        self.name = name

    def __str__(self):
        return f"User(name={self.name})"

    def to_json(self):
        return {"name": self.name}
