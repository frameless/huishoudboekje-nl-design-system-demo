import re

def convert_hhb_interval_to_iso(graphql_format: dict):
    isoformat = "P"
    isoformat += f"{graphql_format.get('jaren', 0)}Y"
    isoformat += f"{graphql_format.get('maanden', 0)}M"
    isoformat += f"{graphql_format.get('weken', 0)}W"
    isoformat += f"{graphql_format.get('dagen', 0)}D"
    return isoformat

def convert_hhb_interval_to_dict(iso_format: str):
    if not iso_format:
        iso_format = "P0Y0M0W0D"
    graphql_format = {
        "jaren": int(re.compile(r'\d+Y').findall(iso_format)[0][:-1]),
        "maanden": int(re.compile(r'\d+M').findall(iso_format)[0][:-1]),
        "weken": int(re.compile(r'\d+W').findall(iso_format)[0][:-1]),
        "dagen": int(re.compile(r'\d+D').findall(iso_format)[0][:-1])
    }
    return graphql_format
