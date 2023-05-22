from typing import Any

class GetRequestObject():
    """
        An object that has all the information of the request.
        This is still a concept. 
        It can be used to request all objects of the given model. And it can have search filters and paramaters.
    """
    def __init__(self) -> None:
        self.body = {}
        self.params = {}
        self.filter = {}
        self.base_url = ""
        self.model = ""
        self.extra_url_segments = []

    def add_to_body(self, key: str, value: Any) -> None:
        self.body.update({key: value})

    def add_to_filter(self, key: str, value: Any) -> None:
        self.filter.update({key: value})

    def add_to_params(self, key: str, value: Any) -> None:
        self.params.update({key: value})

    def set_base_url(self, url: str) -> None:
        self.base_url = url

    def set_model(self, model: str) -> None:
        self.model = model

    def add_url_segment(self, url: str) -> None:
        self.extra_url_segments.append(url)

    def get_url(self) -> str:
        url = self.base_url + "/" + self.model
        if len(self.extra_url_segments) > 0:
            for segment in self.extra_url_segments:
                url = url + "/" + segment
        return url

    def get_service(self) -> str:
        return self.base_url

    def get_body(self) -> dict:
        return_body = self.body.copy()
        if self.filter: #Check if filter dict is empty
            return_body.update({"filter": self.filter})
        return return_body
    
    def get_params(self) -> dict:
        return self.params.copy()
