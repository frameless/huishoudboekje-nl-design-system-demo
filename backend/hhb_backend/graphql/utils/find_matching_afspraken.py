import re

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.dates import afspraken_intersect, to_date


def find_matching_afspraken_by_afspraak(main_afspraak):
    matching_afspraken = []
    if not main_afspraak.get("zoektermen"):  
        return matching_afspraken

        
    

    afspraken = hhb_dataloader().afspraken.by_rekening(main_afspraak.get("tegen_rekening_id"))

    zoektermen_main = ' '.join(main_afspraak.get("zoektermen"))
    main_afspraak_valid_from = to_date(main_afspraak.get("valid_from"))
    main_afspraak_valid_through = to_date(main_afspraak.get("valid_through"))

    for afspraak in afspraken:
        if afspraak.zoektermen:
            zoektermen_afspraak = ' '.join(afspraak.zoektermen)

            not_main_afspraak = (afspraak.id != main_afspraak.get("id"))


            matching_zoekterm = match_zoekterm(afspraak, zoektermen_main) or match_zoekterm(main_afspraak, zoektermen_afspraak)

            afspraak_valid_from = to_date(afspraak.valid_from)
            afspraak_valid_through = to_date(afspraak.valid_through)
            afspraken_overlap = afspraken_intersect(
                valid_from1=main_afspraak_valid_from,
                valid_from2=afspraak_valid_from,
                valid_through1=main_afspraak_valid_through,
                valid_through2=afspraak_valid_through
            )

            if not_main_afspraak and matching_zoekterm and afspraken_overlap:
                matching_afspraken.append(afspraak)

    return matching_afspraken

def find_similar_afspraken_by_afspraak(main_afspraak):
    matching_afspraken = []
    if not main_afspraak.get("zoektermen"):  
        return matching_afspraken

        
    
    afspraken = hhb_dataloader().afspraken.by_rekening(main_afspraak.get("tegen_rekening_id"))
    afspraken.extend(hhb_dataloader().afspraken.by_afdeling(main_afspraak.get("afdeling_id")))

    zoektermen_main = ' '.join(main_afspraak.get("zoektermen"))
    main_afspraak_valid_from = to_date(main_afspraak.get("valid_from"))
    main_afspraak_valid_through = to_date(main_afspraak.get("valid_through"))

    for afspraak in afspraken:
        if afspraak.zoektermen:
            zoektermen_afspraak = ' '.join(afspraak.zoektermen)

            not_main_afspraak = (afspraak.id != main_afspraak.get("id"))


            matching_zoekterm = match_similar_zoekterm(afspraak, zoektermen_main) or match_similar_zoekterm(main_afspraak, zoektermen_afspraak)

            afspraak_valid_from = to_date(afspraak.valid_from)
            afspraak_valid_through = to_date(afspraak.valid_through)
            afspraken_overlap = afspraken_intersect(
                valid_from1=main_afspraak_valid_from,
                valid_from2=afspraak_valid_from,
                valid_through1=main_afspraak_valid_through,
                valid_through2=afspraak_valid_through
            )

            if not_main_afspraak and matching_zoekterm and afspraken_overlap:
                matching_afspraken.append(afspraak)

    return matching_afspraken


def match_similar_zoekterm(afspraak, target_text: str):
    return afspraak.get("zoektermen") and any(search_zoektermen_afspraak_in_text(afspraak, target_text))

def match_zoekterm(afspraak, target_text: str):
    return afspraak.get("zoektermen") and all(search_zoektermen_afspraak_in_text(afspraak, target_text))

def matching_zoektermen_count(afspraak, target_text: str):
    return len(list(filter(lambda item: item, search_zoektermen_afspraak_in_text(afspraak, target_text))))

def search_zoektermen_afspraak_in_text(afspraak, target_text: str):
    return[
        re.search(
            re.escape(zoekterm),
            target_text,
            re.IGNORECASE
        ) for zoekterm in afspraak.get("zoektermen")
    ]