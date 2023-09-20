import {gql} from "@apollo/client";

export const GetBurgerRapportageQuery = gql`
    query getBurgerRapportages($burgers:[Int!]!,$start:String!,$end:String!,$rubrieken:[Int!]!, $saldoDate:Date!) {
        burgerRapportages(burgerIds:$burgers startDate:$start, endDate:$end, rubriekenIds:$rubrieken){
            burger{
                voornamen
            }
            startDatum
            eindDatum
            totaal
            totaalUitgaven
            totaalInkomsten
            inkomsten {
                rubriek
                transacties{
                    bedrag
                    transactieDatum
                    rekeninghouder        
                }
            }
            uitgaven{
                rubriek
                transacties{
                    bedrag
                    transactieDatum
                    rekeninghouder
                }
            }
        }
        saldo(burgerIds: $burgers, date: $saldoDate) {
            saldo
        }
    }
`;