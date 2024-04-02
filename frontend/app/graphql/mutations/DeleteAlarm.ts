import {gql} from "@apollo/client";

export const DeleteAlarmMutation = gql`
    mutation deleteAlarm($input: AlarmId!){
        Alarms_Delete(input: $input){
            deleted
        }
    }
`;