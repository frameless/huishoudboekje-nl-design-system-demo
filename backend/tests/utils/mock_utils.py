from urllib.parse import unquote


# Mock feature flags by name and status
def mock_feature_flag(flag_name: str, flag_enabled: bool):
    def is_enabled(self, name):
        if name == flag_name:
            return flag_enabled
        return False

    return is_enabled


def get_by_filter(request, items):
    return _get_by_filter_or(request, items, False)


def get_by_filter_or_fallback(request, items):
    return _get_by_filter_or(request, items, True)


def _get_by_filter_or(request, items: dict, enable_fallback: bool):
    filter = request.url.split("=", 1)
    if len(filter) != 2 and enable_fallback:
        return {"data": list(items.values())}
    ids = unquote(filter[1]).split(",")
    int_key = type(next(iter(items.keys()))) == int
    data = []
    for id in ids:
        id = int(id) if int_key else id
        if id in items:
            data.append(items[id])
    return {"data": data}
