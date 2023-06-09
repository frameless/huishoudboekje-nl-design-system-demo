import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/Afspraak";

export const GetAfspraakFormDataQuery = gql`
    query getAfspraakFormData($afspraakId: Int!) {
        afspraak(id: $afspraakId){
            id
            omschrijving
            bedrag
            credit
            zoektermen
            validFrom
            validThrough
            burger {
                id
                bsn
                voornamen
                voorletters
                achternaam
                plaatsnaam
                rekeningen {
                    id
                    iban
                    rekeninghouder
                }
            }
            afdeling {
                id
                organisatie {
                    id
                    naam
                    kvknummer
                    vestigingsnummer
                    afdelingen {
                        ...Afdeling
                    }
                }
            }
            postadres {
                ...Postadres
            }
            tegenRekening {
                id
                iban
                rekeninghouder
            }
            rubriek {
                id
                naam
                grootboekrekening{
                    id
                    naam
                    credit
                }
            }
        }
        rubrieken {
            id
            naam
            grootboekrekening{
                id
                naam
                credit
            }
        }
        organisaties {
            id
            naam
            kvknummer
            vestigingsnummer
        }
    }
    ${AfspraakFragment}
`;