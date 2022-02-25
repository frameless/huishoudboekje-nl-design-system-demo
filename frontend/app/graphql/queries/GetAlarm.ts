import {gql} from "@apollo/client";
import {AlarmFragment} from "../fragments/Alarm";

export const GetAlarmQuery = gql`
    query getAlarm($id: String!) {
        alarm(id: $id) {
            ...Alarm
        }
    }
    ${AlarmFragment}
`;