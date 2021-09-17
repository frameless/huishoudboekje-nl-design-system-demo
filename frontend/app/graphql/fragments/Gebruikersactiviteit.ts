import {gql} from "@apollo/client";
import {OrganisatieFragment} from "./Organisatie";

export const GebruikersactiviteitFragment = gql`
    fragment Gebruikersactiviteit on GebruikersActiviteit {
        id
        timestamp
        gebruikerId
        action
        entities {
            entityType
            entityId
            huishouden {
                id
                burgers {
                    id
                    voorletters
                    voornamen
                    achternaam
                }
            }
            burger {
                id
                voorletters
                voornamen
                achternaam
            }
            organisatie {
                ...Organisatie
            }
            afspraak {
                id
                organisatie {
                    ...Organisatie
                }
            }
            rekening {
                id
                iban
                rekeninghouder
            }
            customerStatementMessage {
                id
                filename
                bankTransactions {
                    id
                }
            }
            configuratie {
                id 
                waarde
            }
            rubriek {
                id
                naam
                grootboekrekening {
                    naam
                }
            }
        }
#       snapshotBefore{
#           burger{id}
#           organisatie{id}
#           afspraak{id}
#           journaalpost{id}
#       }
#       snapshotAfter{
#           burger{id}
#           organisatie{id}
#           afspraak{id}
#           journaalpost{id}
#       }
        meta {
            userAgent
            ip
            applicationVersion
        }
    }
    ${OrganisatieFragment}
`;