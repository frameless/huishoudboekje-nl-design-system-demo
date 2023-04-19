from typing import Any

class RequestFilter():
    def __init__(self) -> None:
        self.body = {}
        self.params = {}

    def add_to_body(self, key: str, value: Any) -> None:
        self.body.update({key: value})

    def add_to_params(self, key: str, value: Any) -> None:
        self.params.update({key: value})
