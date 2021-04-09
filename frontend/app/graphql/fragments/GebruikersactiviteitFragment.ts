import {gql} from "@apollo/client";

export const GebruikersactiviteitFragment = gql`
    fragment Gebruikersactiviteit on GebruikersActiviteit {
        id
        timestamp
        gebruikerId
        action
        entities {
            entityType
            entityId
            burger {
                id
                voorletters
                voornamen
                achternaam
            }
            organisatie {
                id
                weergaveNaam
            }
            afspraak {
                id
                organisatie {
                    id
                    weergaveNaam
                }
            }
            rekening {
                id
                iban
                rekeninghouder
            }
            customerStatementMessage {
                id
            }
            configuratie {
                id 
                waarde
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
`;