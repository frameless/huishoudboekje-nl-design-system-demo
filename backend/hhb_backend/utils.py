import re

def convert_hhb_interval_to_iso(graphql_format: dict):
    if any (graphql_format.get(k,None) for k in ('jaren', 'maanden','weken','dagen')):
        isoformat = "P"
        isoformat += f"{graphql_format.get('jaren', 0)}Y"
        isoformat += f"{graphql_format.get('maanden', 0)}M"
        isoformat += f"{graphql_format.get('weken', 0)}W"
        isoformat += f"{graphql_format.get('dagen', 0)}D"
        return isoformat
    return None

def convert_hhb_interval_to_dict(iso_format: str):
    print(type(iso_format))
    print(iso_format)
    if iso_format:
        print("if")
        p = re.compile(r'P(\d+)Y(\d+)M(\d+)W(\d+)D').findall(iso_format)
        if p:
            print("=====")
            print(p)
            return {
                "jaren": int(p[0][0]),
                "maanden": int(p[0][1]),
                "weken": int(p[0][2]),
                "dagen": int(p[0][3])
            }
    return {"jaren": 0, "maanden": 0, "weken": 0, "dagen":0}
