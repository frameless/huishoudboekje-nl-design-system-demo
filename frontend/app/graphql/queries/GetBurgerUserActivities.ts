import {gql} from "@apollo/client";


export const GetBurgerUserActivitiesQuery = gql`
	query GetBurgerUserActivitiesQuery($ids: [Int!]!, $input: UserActivitiesPagedRequest) {
		burgers(ids: $ids) {
			id
			voornamen
			voorletters
			achternaam
		}
        UserActivities_GetUserActivitiesPaged(input: $input) {
            data {
                id
                timestamp
                user
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
                meta {
                    userAgent
                    ip
                    applicationVersion
                    name
                }
            }
            PageInfo{
                total_count
            }
        }
    }
`;
