import {gql} from "@apollo/client";

export const CreateAlarmMutation = gql`
    mutation createAlarm($input: CreateAlarmInput!) {
        createAlarm(input: $input){
            ok
            alarm {
                ...Alarm
            }
        }
    }
`;