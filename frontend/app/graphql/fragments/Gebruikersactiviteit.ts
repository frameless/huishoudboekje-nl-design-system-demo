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
                id
                naam
                kvknummer
                vestigingsnummer
            }
            afspraak {
                id
                burger {
                    id
                    voornamen
                    voorletters
                    achternaam
                }
                afdeling {
                    id
                    naam
                    organisatie {
                        id
                        kvknummer
                        vestigingsnummer
                        naam
                    }
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
            }
            afdeling {
                id
                naam
                organisatie {
                    id
                    naam
                }
            }
            postadres {
                id
            }
            export {
                id
                naam
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
