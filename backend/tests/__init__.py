def post_echo(request, _context):
    return {"data": (request.json())}

def post_echo_with_id(start: int = 0):
    last_id = start

    def post(request, _context):
        nonlocal last_id
        last_id += 1
        return {"data": {"id": last_id, **(request.json())}}

    return post

def post_echo_with_str_id(id: str):
    post_id = id
    
    def post(request, _context):
        nonlocal post_id
        return {"data": {"id": post_id, **(request.json())}}

    return post