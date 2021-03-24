from typing import List

from flask_rbac import RoleMixin, UserMixin

from hhb_backend.auth.token_provider import TokenProvider


class Role(RoleMixin):
    def __init__(self, name=None):
        super().__init__(name)

    def __str__(self):
        return f"Role(name={self.get_name()})"


class User(UserMixin):
    def __init__(self, email: str = None, roles: List[str] = [], token_provider: TokenProvider = TokenProvider(), is_authenticated: bool = True):
        super().__init__(roles)
        self.email = email
        self.token_provider = token_provider
        self.is_authenticated = is_authenticated

    def __str__(self):
        return f"User(email={self.email},roles=[{','.join([str(role) for role in self.roles])}],is_authenticated={self.is_authenticated})"

    @property
    def token(self):
        return self.token_provider.token(self)