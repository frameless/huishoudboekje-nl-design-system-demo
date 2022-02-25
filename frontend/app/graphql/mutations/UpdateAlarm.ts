import {gql} from "@apollo/client";

export const UpdateAlarmMutation = gql`
    mutation updateAlarm($id: String!, $input: UpdateAlarmInput!){
        updateAlarm(id: $id, input: $input){
            ok
            alarm {
                ...Alarm
            }
        }
    }
`;