import {gql} from "@apollo/client";

export const UpdateBurgerSaldoAlarmMutation = gql`
    mutation updateBurgerSaldoAlarm(
        $id: Int!
        $saldoAlarm: Boolean!
    ){
        updateBurgerSaldoAlarm(
            id: $id
            saldoAlarm: $saldoAlarm
        ){
            ok
            burger {
                id
                bsn
                saldoAlarm
                email
                telefoonnummer
                voorletters
                voornamen
                achternaam
                geboortedatum
                straatnaam
                huisnummer
                postcode
                plaatsnaam
            }
        }
    }
`;