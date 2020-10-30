import re

def convert_hhb_interval_to_iso(graphql_format: dict):
    if any (graphql_format.get(k,None) for k in ('jaren', 'maanden','weken','dagen')):
        isoformat = "P"
        if graphql_format.get('jaren', None):
            isoformat += f"{graphql_format.get('jaren')}Y"
        if graphql_format.get('maanden', None):
            isoformat += f"{graphql_format.get('maanden')}M"
        if graphql_format.get('weken', None):
            isoformat += f"{graphql_format.get('weken')}W"
        if graphql_format.get('dagen', None):
            isoformat += f"{graphql_format.get('dagen')}D"
        return isoformat
    return None

def convert_hhb_interval_to_dict(iso_format: str):
    if iso_format:
        p = re.compile(r'P(\d+)Y(\d+)M(\d+)W(\d+)D').findall(iso_format)
        if p:
            return {
                "jaren": int(p[0][0]),
                "maanden": int(p[0][1]),
                "weken": int(p[0][2]),
                "dagen": int(p[0][3])
            }
    return {"jaren": 0, "maanden": 0, "weken": 0, "dagen":0}
