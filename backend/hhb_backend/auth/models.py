
class User():
    def __init__(self, email: str = None, name: str = None):
        self.email = email
        self.name = name

    def __str__(self):
        return f"User(email={self.email},name={self.name})"
