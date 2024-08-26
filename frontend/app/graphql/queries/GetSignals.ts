import {gql} from "@apollo/client";

export const GetSignalsPagedQuery = gql`
    query GetSignalsPaged($input: SignalsPagedRequest) {
        Signals_GetPaged(input: $input){
            data {
                alarmId
                createdAt
                id
                isActive
                journalEntryIds
                agreement {
                    id
                    omschrijving
                }
                citizen {
                    id
                    voornamen
                    achternaam
                    voorletters
                }
                journalEntries {
                    id
                    transactionUuid
                    transaction {
                        id
                        amount
                    }
                }
                offByAmount
                signalType
                updatedAt
            }
            PageInfo {
                skip
                take
                total_count
            }
        }
    }
`;

export const GetCitizensSignalsFilterQuery = gql`
    query GetCitizensSignalsFilter{
		burgers {
			id
            uuid
            voornamen
            achternaam
		}
    }
`;

export const GetSignalsCountQuery = gql`
    query GetSignalsCount { 
        Signals_GetActiveSignalsCount {
        count
      }
    }
`;