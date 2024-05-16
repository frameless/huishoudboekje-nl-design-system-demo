
def get_object_by_id(id, objects_list):
    filtered_objects = filter(lambda obj: obj.id == id, objects_list)
    return next(filtered_objects, None)

def sort_result(ids, objects_list):
    result = []
    for id in ids:
        result.append(get_object_by_id(id, objects_list))
    return result