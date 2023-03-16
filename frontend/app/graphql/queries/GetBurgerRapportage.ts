import {gql} from "@apollo/client";

export const GetBurgerRapportageQuery = gql`
    query getBurgerRapportage($burger:Int!,$start:Date!,$end:Date!) {
        burgerRapportage(burgerId:$burger, startDate:$start, endDate:$end){
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
    }
`;