import {gql} from "@apollo/client";

export const AlarmFragment = gql`
    fragment Alarm on Alarm {
        id
        bedrag
        bedragMargin
        datum
        datumMargin
        gebruikerEmail
        isActive
        afspraak {
            id
        }
        signaal {
            id
        }
    }
`;