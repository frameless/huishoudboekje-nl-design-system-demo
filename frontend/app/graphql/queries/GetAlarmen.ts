import {gql} from "@apollo/client";
import {AlarmFragment} from "../fragments/Alarm";

export const GetAlarmenQuery = gql`
    query getAlarmen {
        alarmen {
            ...Alarm
        }
    }
    ${AlarmFragment}
`;